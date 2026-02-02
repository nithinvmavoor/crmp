import axios from "axios";
import { env } from "../config/env";

export const catalogClient = {
    async getItemsByIds(ids: string[], token?: string) {
        const resp = await axios.post(
            `${env.CATALOG_SERVICE_URL}/catalog/items/by-ids`,
            { ids },
            { headers: { Authorization: token } }
        );

        return resp.data?.data ?? [];
    },
};
