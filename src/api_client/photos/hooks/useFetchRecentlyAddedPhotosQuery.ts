import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { parseWithNotification } from "../../../util/zodUtils";
import { fetchClient } from "../../api";
import { PigPhoto } from "../types";

export const RecentlyAddedPhotosQueryKeys = ["recentlyAddedPhotos"] as const;

/** Inclusive lookback requested from GET /photos/recentlyadded/. */
export const RECENTLY_ADDED_LOOKBACK_DAYS = 7;

const RecentlyAddedPhotosResponse = z.object({
  results: PigPhoto.array(),
  date: z.string(),
});
type RecentlyAddedPhotosResponse = z.infer<typeof RecentlyAddedPhotosResponse>;

// Fetch recently added photos for the requested lookback window.
export const useFetchRecentlyAddedPhotosQuery = () =>
  useQuery({
    queryKey: [...RecentlyAddedPhotosQueryKeys, RECENTLY_ADDED_LOOKBACK_DAYS],
    queryFn: async () => {
      const response = await fetchClient.get(`/photos/recentlyadded/?days=${RECENTLY_ADDED_LOOKBACK_DAYS}`);
      return parseWithNotification(RecentlyAddedPhotosResponse, response, "Failed to parse recently added photos");
    },
  });
