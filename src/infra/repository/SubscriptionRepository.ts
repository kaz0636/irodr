// MIT © 2017 azu
import { NullableBaseRepository } from "ddd-base/lib/NullableBaseRepository";
import { Subscription } from "../../domain/Subscriptions/Subscription";
import { SubscriptionGroupByCategoryMap } from "../../domain/Subscriptions/InfraSubscription";
import { MapLike } from "map-like";

export class SubscriptionRepository extends NullableBaseRepository<Subscription> {
    categoryMap: SubscriptionGroupByCategoryMap;

    constructor() {
        super();
        this.categoryMap = new MapLike<string, Subscription[]>();
    }

    groupByCategory() {
        return this.categoryMap;
    }

    getAllCategories() {
        return this.categoryMap.keys();
    }

    getAllByCategories(category: string) {
        return this.categoryMap.get(category);
    }

    save(subscription: Subscription) {
        super.save(subscription);
        subscription.categories.forEach(category => {
            if (this.categoryMap.has(category)) {
                this.categoryMap.set(category, this.categoryMap.get(category)!.concat(subscription));
            } else {
                this.categoryMap.set(category, [subscription]);
            }
        });
    }
}

export const subscriptionRepository = new SubscriptionRepository();