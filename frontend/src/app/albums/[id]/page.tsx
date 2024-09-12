// src/app/albums/[id]/page.tsx

interface AlbumDetailProps {
  params: {
    id: string; // Define the type of the parameter
  };
}

const AlbumDetail = ({ params }: AlbumDetailProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Album Detail Page</h1>
      <p>Album ID: {params.id}</p>
    </div>
  );
};

export default AlbumDetail;
