import { API_BASE_URL } from "../data/repo/endpoints";

async function getPointPropertiesByGuide(guideId) {
  const url = `${API_BASE_URL}/guidegroup/property/${guideId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch properties for ${guideId}`);
  }

  const json = await response.json();

  return json;
}

export default { getPointPropertiesByGuide };
