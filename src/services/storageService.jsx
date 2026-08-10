const setPdfProgress = (progress) => {
  localStorage.setItem('pdfProgress', progress);
};

const getPdfProgress = () => {
  const progress = localStorage.getItem('pdfProgress');

  return progress ? Number(progress) : 0;
};

export default {
  setPdfProgress,
  getPdfProgress
};
