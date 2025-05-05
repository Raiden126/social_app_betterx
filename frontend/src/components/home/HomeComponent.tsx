import MainLayout from "../layouts/MainLayout";
import Post from "../post/Post";

const HomeComponent = () => {

  return (
    <MainLayout>
      <div className="flex flex-col items-start jussta space-y-6 p-4 sm:p-6 md:p-8">
        <Post />
      </div>
    </MainLayout>
  );
};

export default HomeComponent;
