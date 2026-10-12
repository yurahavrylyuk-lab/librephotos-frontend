import { useQuery } from "@tanstack/react-query";
import { parseWithNotification } from "../../../util/zodUtils";
import { fetchClient } from "../../api";
import { UserAlbumListResponse } from "../types";

export const UserAlbumsQueryKeys = ["userAlbums"] as const;

/** Server-side sort for GET /albums/user/list/ (Django REST ordering filter). */
const USER_ALBUM_LIST_ORDERING = "title";

export const useFetchUserAlbumsQuery = (skip: boolean = false) =>
  useQuery({
    queryKey: [...UserAlbumsQueryKeys, { ordering: USER_ALBUM_LIST_ORDERING }],
    queryFn: async () => {
      const params = new URLSearchParams({ ordering: USER_ALBUM_LIST_ORDERING });
      const response = await fetchClient.get(`/albums/user/list/?${params.toString()}`);
      return parseWithNotification(UserAlbumListResponse, response, "Failed to parse user albums").results;
    },
    enabled: !skip,
  });
