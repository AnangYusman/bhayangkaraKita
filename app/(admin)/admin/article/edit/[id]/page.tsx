import EditArticleForm from "@/components/form/article/edit-article-form";

export default function UpdateArticlePage() {
  return (
    <div>
      {/* <div className="flex flex-row justify-between border-b-2 px-4 bg-white shadow-md">
        <div className="flex flex-col gap-1 py-2">
          <h1 className="font-bold text-[25px]">Article</h1>
          <p className="text-[14px]">Article</p>
        </div>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 20 20">
            <path fill="currentColor" d="M5 1a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 3h5v1H5zm0 2h5v1H5zm0 2h5v1H5zm10 7H5v-1h10zm0-2H5v-1h10zm0-2H5v-1h10zm0-2h-4V4h4z" />
          </svg>
        </span>
      </div> */}
      <div className="h-[96vh] p-3 lg:p-8 bg-slate-100 dark:!bg-black overflow-y-auto">
        <EditArticleForm isDetail={false} />
      </div>
    </div>
  );
}
