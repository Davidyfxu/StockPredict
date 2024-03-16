export const post = async (url: string, body: any): Promise<any> => {
  try {
    const response = await fetch(url);
    const res = await response.json();
    return res;
  } catch (e: any) {
    console.error("Error:", e);
  }
};
