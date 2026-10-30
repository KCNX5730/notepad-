import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProjectFile, PreviewDevice, ConsoleMessage } from '../types';
import { 
  Laptop, Smartphone, Tablet, Monitor, RotateCw, 
  ExternalLink, ZoomIn, ZoomOut, Check, Wifi, Play, Volume2
} from 'lucide-react';

interface LivePreviewProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onConsoleMessage: (msg: ConsoleMessage) => void;
  runTrigger: number; // Increment to force refresh
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  files,
  activeFileId,
  onConsoleMessage,
  runTrigger,
}) => {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(100);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Bundle HTML, CSS, and JS files together
  const generatedSrcDoc = useMemo(() => {
    // Find entry html file (either active file if html, or index.html, or first html file)
    let htmlFile = files.find(f => f.id === activeFileId && f.type === 'html');
    if (!htmlFile) htmlFile = files.find(f => f.name === 'index.html');
    if (!htmlFile) htmlFile = files.find(f => f.type === 'html');

    if (!htmlFile) {
      return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:20px;color:#666">No HTML file to display. Create an index.html file to preview.</body></html>`;
    }

    let content = htmlFile.content;

    // Inline CSS files referenced in <link rel="stylesheet" href="...">
    files.filter(f => f.type === 'css').forEach(cssFile => {
      const fileName = cssFile.name;
      const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\.\\/)?${fileName}["'][^>]*>`, 'gi');
      if (linkRegex.test(content)) {
        content = content.replace(linkRegex, `<style>/* ${fileName} */\n${cssFile.content}\n</style>`);
      } else {
        // If not explicitly linked, append style block
        content = content.replace('</head>', `<style>/* ${fileName} */\n${cssFile.content}\n</style></head>`);
      }
    });

    // Console logging interceptor script to route console output to IDE
    const consoleInterceptorScript = `
<script>
(function() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  function safeSerialize(args) {
    return args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try { return JSON.stringify(arg); } catch(e) { return String(arg); }
      }
      return String(arg);
    }).join(' ');
  }

  console.log = function(...args) {
    originalLog.apply(console, args);
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'log', message: safeSerialize(args) }, '*');
  };

  console.warn = function(...args) {
    originalWarn.apply(console, args);
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', message: safeSerialize(args) }, '*');
  };

  console.error = function(...args) {
    originalError.apply(console, args);
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: safeSerialize(args) }, '*');
  };

  console.info = function(...args) {
    originalInfo.apply(console, args);
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'info', message: safeSerialize(args) }, '*');
  };

  window.addEventListener('error', function(e) {
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: e.message + ' at line ' + e.lineno }, '*');
  });
})();
</script>`;

    // Insert interceptor into head
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>${consoleInterceptorScript}`);
    } else {
      content = `${consoleInterceptorScript}${content}`;
    }

    // Inline JS files referenced in <script src="...">
    files.filter(f => f.type === 'js').forEach(jsFile => {
      const fileName = jsFile.name;
      const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\.\\/)?${fileName}["'][^>]*>\\s*<\\/script>`, 'gi');
      if (scriptRegex.test(content)) {
        content = content.replace(scriptRegex, `<script>/* ${fileName} */\n${jsFile.content}\n</script>`);
      }
    });

    return content;
  }, [files, activeFileId, runTrigger]);

  // Handle messages posted from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        onConsoleMessage({
          id: `console-${Date.now()}-${Math.random()}`,
          type: event.data.level || 'log',
          content: event.data.message || '',
          timestamp: timeStr,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generatedSrcDoc;
      const now = new Date();
      setLastRefreshed(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    }
  };

  const handleOpenExternal = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(generatedSrcDoc);
      win.document.close();
    }
  };

  // Dimensions based on device mode
  const getDeviceDimensions = () => {
    switch (device) {
      case 'mobile':
        return isLandscape ? { width: '667px', height: '375px' } : { width: '375px', height: '667px' };
      case 'tablet':
        return isLandscape ? { width: '1024px', height: '768px' } : { width: '768px', height: '1024px' };
      case 'responsive':
        return { width: '100%', height: '100%' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const dims = getDeviceDimensions();

  return (
    <div className="h-full flex flex-col bg-[#eef2f6] border-l border-[#d4d4d4] select-none text-xs overflow-hidden">
      {/* Device & Preview Controls Header */}
      <div className="bg-[#f0f0f0] border-b border-[#d8d8d8] px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-gray-300">
          <button
            onClick={() => setDevice('desktop')}
            title="Desktop View (100%)"
            className={`p-1 rounded transition-colors ${
              device === 'desktop' ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet View (768px)"
            className={`p-1 rounded transition-colors ${
              device === 'tablet' ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            title="Mobile Phone View (375px)"
            className={`p-1 rounded transition-colors ${
              device === 'mobile' ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Smartphone size={14} />
          </button>
        </div>

        {/* Orientation & Scale */}
        <div className="flex items-center gap-1.5">
          {(device === 'mobile' || device === 'tablet') && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              title="Rotate Screen Orientation"
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1 text-gray-700"
            >
              <RotateCw size={12} />
              <span className="text-[10px]">{isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-white border border-gray-300 rounded px-2 py-1">
            <button onClick={() => setScale(Math.max(50, scale - 10))} title="Zoom Out Preview">
              -
            </button>
            <span className="w-8 text-center">{scale}%</span>
            <button onClick={() => setScale(Math.min(150, scale + 10))} title="Zoom In Preview">
              +
            </button>
          </div>
        </div>

        {/* Actions: Reload & External Popout */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            title="Refresh Preview"
            className="p-1 hover:bg-[#e4e4e4] rounded text-gray-700 border border-transparent hover:border-gray-300 transition-colors"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={handleOpenExternal}
            title="Open in Standalone New Window"
            className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-gray-700 flex items-center gap-1 transition-colors font-medium text-[11px]"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Pop Out</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-[#dbe2ea] relative">
        <div
          style={{
            width: dims.width,
            height: dims.height,
            transform: scale !== 100 ? `scale(${scale / 100})` : undefined,
            transformOrigin: 'top center',
            transition: 'width 0.25s ease, height 0.25s ease',
          }}
          className={`bg-white shadow-xl flex flex-col overflow-hidden transition-all duration-200 ${
            device !== 'desktop' ? 'rounded-2xl border-8 border-gray-800' : 'w-full h-full border border-gray-300'
          }`}
        >
          {/* Mock Browser/Device Header for tablet/phone */}
          {device !== 'desktop' && (
            <div className="bg-gray-800 text-white px-3 py-1 flex items-center justify-between shrink-0 select-none text-[10px]">
              <div className="w-10 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="bg-gray-700 text-gray-300 px-3 py-0.5 rounded text-[10px] truncate max-w-[200px]">
                localhost:3000/preview
              </div>
              <Wifi size={10} className="text-gray-400" />
            </div>
          )}

          <iframe
            ref={iframeRef}
            srcDoc={generatedSrcDoc}
            title="Live Web Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full flex-1 border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
