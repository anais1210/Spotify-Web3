const Albums = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular albums</h2>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {[
          { title: "HIT ME HARD AND SOFT", artist: "Billie Eilish" },
          { title: "SOIS PAS TIMIDE", artist: "GIMS" },
          { title: "SPIDER", artist: "GIMS, DYSTINCT" },
          { title: "Destin", artist: "Ninho" },
          { title: "Pyramide", artist: "Werenoi" },
          { title: "VENI VIDI VICI", artist: "Lacrim" },
          { title: "Capitaine fait de l'art", artist: "Leto" },
        ].map((album) => (
          <div key={album.title} className="text-center">
            <div className="bg-gray-800 w-24 h-24 mx-auto"></div>
            <p className="mt-2 text-sm">{album.title}</p>
            <p className="text-gray-400 text-xs">{album.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Albums;
