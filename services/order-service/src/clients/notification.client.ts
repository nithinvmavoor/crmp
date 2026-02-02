import axios from "axios";
import { env } from "../config/env";
import { logger } from "@crmp/common";

export const notificationClient = {
    triggerOrderCreated: async (payload: any, token?: string) => {
        axios
            .post(`${env.NOTIFICATION_SERVICE_URL}/notifications/notify`, payload, {
                headers: { Authorization: token },
            })
            .catch((err) => {
                logger("error", "Notification trigger failed", { errorMessage: err.message });
            });
    },
};
