const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
  p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 ml-4" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 ml-4" {...props} />,
  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono" {...props} />
    ) : (
      <code className="bg-gray-100 p-4 rounded-lg block my-4 text-sm font-mono overflow-x-auto" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-700" {...props} />
  ),
  a: ({ node, ...props }) => <a className="text-purple-600 hover:underline" {...props} />
};

export default markdownComponents;
