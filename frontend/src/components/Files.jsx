"use client";
export default function Files(props) {
  const copyLink = async () => {
    const copyText = `${window.location.origin}/${props.cid}`;
    await navigator.clipboard.writeText(copyText);
    alert("Copied: " + copyText);
  };

  return (
    <div
      onClick={copyLink}
      className="m-auto mt-8 flex w-3/4 cursor-pointer flex-row justify-around rounded-lg"
    >
      <p>{props.cid}</p>
    </div>
  );
}
