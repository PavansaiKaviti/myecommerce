export const fetchimages = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN_API}/profile/upload`, {
      cache: "no-store",
    });
    if (res.status !== 200) {
      console.log("Error:", res.status);
      return;
    }
    return res.json();
  } catch (error) {
    console.log("Error:", error);
  }
};
