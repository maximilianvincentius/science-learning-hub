const _getProgressStatus = (progress) => (progress < 100 ? 'IN PROGRESS' : 'COMPLETED');

const ProgressBar = ({ progress, title, animatedProgress }) => {
  return (
    <div className="mt-auto flex flex-col gap-2 pt-3 pb-4">
      <div className="flex items-center justify-between">
        <span
          className={` ${progress < 100 ? 'bg-brand-primary/10 text-brand-primary' : 'bg-green-100 text-green-600'} inline-flex items-center rounded-full px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide`}
        >
          {_getProgressStatus(progress)}
        </span>
        <span className="font-body text-sm font-bold text-brand-primary">{progress}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-700 ease-out"
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
