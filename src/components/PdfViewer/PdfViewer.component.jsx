import { Skeleton } from 'antd';
import { lazy, useEffect, useState } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { storageService } from '../../services';

const _useEffectScreenResize = (setWindowWidth) => {
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
};

const _useEffectPdfScrollProgress = (state, onProgress, data) => {
  const el = state.containerRef.current;
  if (!el) {
    return;
  }

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      onProgress?.(100);
      return;
    }

    let currentValue = Math.floor((scrollTop / maxScroll) * 100);
    if (currentValue >= 95 || scrollTop >= maxScroll - 1) {
      currentValue = 100;
    }
    if (currentValue > state.maxValueRef.current) {
      state.maxValueRef.current = currentValue;
    }

    onProgress?.(state.maxValueRef.current);
  };

  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
};

const _useDefaultValue = (state, onProgress) => {
  useEffect(() => {
    const savedProgress = storageService.getPdfProgress();
    if (savedProgress) {
      state.maxValueRef.current = savedProgress;
      onProgress?.(savedProgress);
    } else {
      state.maxValueRef.current = 0;
    }
  }, []);
};

const _renderLoading = () => (
  <Skeleton.Node active={true} className="min-w-[200px] min-h-[500px] md:min-w-[500px] lg:min-w-[800px]" />
);

const PdfViewer = lazy(async () => {
  const { Document, Page, pdfjs } = await import('react-pdf');
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const Viewer = ({ data, state, onProgress }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [_, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const handleDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };

    _useDefaultValue(state, onProgress);
    _useEffectScreenResize(setWindowWidth);
    _useEffectPdfScrollProgress(state, onProgress);

    return (
      <div
        className="flex justify-center w-full bg-slate-200 rounded-xl max-h-[75vh] overflow-y-auto"
        ref={state.containerRef}
      >
        <Document file={data.content} onLoadSuccess={handleDocumentLoadSuccess} loading={_renderLoading()}>
          {Array.from(new Array(numPages || 0), (_, index) => (
            <Page
              loading="Loading page..."
              width={Math.min(windowWidth - 60, 850)}
              key={index}
              pageNumber={index + 1}
              onRenderSuccess={() => setCurrentPage(index + 1)}
            />
          ))}
        </Document>
      </div>
    );
  };

  return { default: Viewer };
});

export default PdfViewer;
