import { httpGet, httpPost, httpPost2 } from "./http-config/disestages-services";


interface GenerateKeywordsAndTitleRequestData {
  keyword: string;
  style: string;
  website: string;
  connectToWeb: boolean;
  lang: string;
  pointOfView: string;
  clientId: string;
}

interface GenerateArticleRequest {
  advConfig: string;
  style: string;
  website: string;
  connectToWeb: boolean;
  lang: string;
  pointOfView: string;
  title: string;
  imageSource: string;
  mainKeyword: string;
  additionalKeywords: string;
  targetCountry: null;
  articleSize: string;
  projectId: number;
  createdBy: string;
  clientId: string;
}

type BulkArticleRequest = {
  style: string;
  website: string;
  connectToWeb: boolean;
  lang: string;
  pointOfView: string;
  imageSource: string;
  targetCountry: null;
  articleSize: string;
  projectId: number;
  data: { title: string; mainKeyword: string; additionalKeywords: string }[];
  createdBy: string;
  clientId: string;
};

interface ContentRewriteRequest {
  advConfig: string;
  context: string | null;
  style: string;
  sentiment: string;
  clientId: string;
  createdBy: string;
  contextType: string;
  urlContext: string | null;
  lang: string;
}

export type ContentBankRequest = {
  query: string;
  page: number;
  userId: string;
  limit: number;
  status: number[];
  isSingle: boolean;
  createdBy: string;
  sort: { column: string; sort: string }[];
};

export async function getGenerateTitle(
  data: GenerateKeywordsAndTitleRequestData
) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/generate-title", headers, data);
}

export async function getGenerateKeywords(
  data: GenerateKeywordsAndTitleRequestData
) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/generate-keywords", headers, data);
}

export async function generateDataArticle(data: GenerateArticleRequest) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/save-article", headers, data);
}

export async function approveArticle(props: { id: number[] }) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/approve-article", headers, props);
}
export async function rejectArticle(props: { id: number[] }) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/reject-article", headers, props);
}

export async function getGenerateTopicKeywords(data: {
  keyword: string;
  count: number;
}) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/generate-topic-keywords", headers, data);
}

export async function saveBulkArticle(data: BulkArticleRequest) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/save-bulk-article", headers, data);
}

export async function getDetailArticle(id: number) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpGet(`ai-writer/article/findArticleById/${id}`, headers);
}

export async function generateSpeechToText(data: any) {
  const headers = {
    "content-type": "multipart/form-data",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/speech-to-text", headers, data);
}

export async function getTranscriptById(id: number) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpGet(`ai-writer/speech-to-text/findById/${id}`, headers);
}

export async function getGenerateRewriter(data: ContentRewriteRequest) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/create-rewriter", headers, data);
}

export async function getListTranscript(data: any) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/speech-to-text/datatable", headers, data);
}

export async function getListArticleDraft(data: ContentBankRequest) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/article/datatable", headers, data);
}

export async function updateManualArticle(data: any) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/update-article", headers, data);
}

export async function getSeoScore(id: string) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpGet(`ai-writer/article/checkSEOScore/${id}`, headers);
}

export async function regenerateArticle(id: number | string) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpGet(`ai-writer/re-create-article/${id}`, headers);
}

export async function saveManualContext(data: any) {
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost("ai-writer/create-article", headers, data);
}

export async function facebookHumasData() {
  const data = {
    monitoringId: "f33b666c-ac07-4cd6-a64e-200465919e8c",
    page: 133,
    limit: 10,
    userId: "0qrwedt9EcuLyOiBUbqhzjd0BwGRjDBd",
  };
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost2(
    "monitoring-media-social/datatable/facebook",
    headers,
    data
  );
}
export async function tiktokHumasData() {
  const data = {
    monitoringId: "1e301867-9599-4d82-ab57-9f7931f96903",
    page: 1,
    limit: 10,
    userId: "0qrwedt9EcuLyOiBUbqhzjd0BwGRjDBd",
  };
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic bmdETFBQaW9ycGx6bncyalRxVmUzWUZDejV4cUtmVUo6UHJEaERXUmNvdkJSNlc1Sg==",
  };
  return await httpPost2(
    "monitoring-media-social/datatable/tiktok",
    headers,
    data
  );
}
