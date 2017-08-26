// MIT © 2017 azu
import { UseCase } from "almin";
import { subscriptionRepository, SubscriptionRepository } from "../../infra/repository/SubscriptionRepository";
import { InoreaderAPI } from "../../infra/api/InoreaderAPI";
import { SubscriptionsResponse } from "../../infra/api/SubscriptionResponse";
import { UnreadCountsResponse } from "../../infra/api/UnreadCountResponse";
import { createSubscriptionsFromResponses } from "../../domain/Subscriptions/SubscriptionFactory";

export const createUpdateSubscriptionsUseCase = () => {
    return new UpdateSubscriptionsUseCase({
        subscriptionRepository
    });
};

export class UpdateSubscriptionsUseCase extends UseCase {
    constructor(private repo: { subscriptionRepository: SubscriptionRepository }) {
        super();
    }

    execute() {
        const client = new InoreaderAPI();
        return Promise.all([
            client.subscriptions(),
            client.unreadCounts()
        ]).then(
            ([newSubscriptionsResponse, newUnreadCountsResponse]: [SubscriptionsResponse, UnreadCountsResponse]) => {
                const subscriptions = createSubscriptionsFromResponses(
                    newSubscriptionsResponse,
                    newUnreadCountsResponse
                );
                subscriptions.forEach(subscription => {
                    this.repo.subscriptionRepository.save(subscription);
                });
            }
        );
    }
}
