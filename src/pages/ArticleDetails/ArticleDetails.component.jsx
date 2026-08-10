import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { publicApi } from '../../api';
import { Content } from 'antd/es/layout/layout';
import { Skeleton } from 'antd';
import markdownComponents from '../../utils/markdownComponents';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { formatDateAndTime } from '../../utils/dateUtils';

const _mapStateToProps = () => {
  const { articleId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const props = {
    articleId,
    setData,
    data,
    loading,
    setLoading
  };

  return props;
};

const _useFetchData = (mappedProps) => {
  const { articleId, setData, setLoading } = mappedProps;

  useEffect(() => {
    const fetchData = async () => {
      let response = await publicApi.get(`/articles/${articleId}`);

      const { data } = response;
      if (data) {
        setLoading(false);
        setData(data);
      }
    };
    fetchData();
  }, []);
};

const _renderArticleHeader = (data, navigate) => (
  <div className="mb-8 pb-8 border-b border-gray-200">
    <button
      type="button"
      onClick={() => {
        navigate(-1);
      }}
      className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <ArrowLeftOutlined />
      Back
    </button>
    <h1 className="text-4xl font-bold mb-4 text-gray-900">{data?.title}</h1>
    <div className="flex items-center gap-4 text-gray-600">
      {data?.author && <span className="text-sm">By {data.author}</span>}
      {data?.topic && (
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          {data.topic}
        </span>
      )}
    </div>
    {data?.updatedAt && <span className="text-xs text-gray-500">Last updated: {formatDateAndTime(data.updatedAt)}</span>}
  </div>
);

const _renderArticleImage = (data) => {
  if (!data?.image) {
    return null;
  }
  return (
    <div className="mb-8">
      <img src={data.image} alt={data.title} className="w-full h-96 object-cover rounded-lg shadow-md" />
    </div>
  );
};

const _renderArticleContent = (data) => (
  <div className="prose prose-sm max-w-none text-gray-700">
    <ReactMarkdown components={markdownComponents}>{data?.content}</ReactMarkdown>
  </div>
);

const _renderSkeleton = () => (
  <div className="space-y-4">
    <Skeleton paragraph={{ rows: 2 }} />
    <Skeleton paragraph={{ rows: 6 }} />
  </div>
);

const ArticleDetails = () => {
  const mappedProps = _mapStateToProps();
  const navigate = useNavigate();

  _useFetchData(mappedProps);

  const { data, loading } = mappedProps;

  return (
    <Content className="px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          _renderSkeleton()
        ) : data ? (
          <>
            {_renderArticleHeader(data, navigate)}
            {_renderArticleImage(data)}
            {_renderArticleContent(data)}
          </>
        ) : (
          <div className="text-center text-gray-500">Article not found</div>
        )}
      </div>
    </Content>
  );
};

export default ArticleDetails;
