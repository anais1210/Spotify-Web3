const Artists = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Popular artists</h2>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {[
          "GIMS",
          "Ninho",
          "Jul",
          "David Guetta",
          "KeBlack",
          "Billie Eilish",
          "PLK",
        ].map((artist) => (
          <div key={artist} className="text-center">
            <div className="bg-gray-800 rounded-full w-24 h-24 mx-auto"></div>
            <p className="mt-2 text-sm">{artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artists;
