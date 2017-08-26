import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "./component/container/App/AppContainer";
import registerServiceWorker from "./registerServiceWorker";
import { InoreaderAPI } from "./infra/api/InoreaderAPI";
import { saveTokenFromCallbackURL } from "./infra/api/auth";
import { Context, Dispatcher } from "almin";
import { appStoreGroup } from "./component/container/App/AppStoreGroup";
import { appLocator } from "./AppLocator";
import AlminReactContainer from "almin-react-container";
import { createBootSubscriptionUseCase } from "./use-case/subscription/BootSubscriptionUseCase";

// require all css files
function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll((require as any).context("./", true, /\.css$/));

if (process.env.NODE_ENV !== "production") {
    (window as any).irodr = {
        get debugClient() {
            return new InoreaderAPI();
        },
        debugGetRequest(api: string) {
            const client = new InoreaderAPI();
            client.getRequest(api).then(response => console.log(response), error => console.error(error));
        }
    };
}
if (location.search.includes("?code")) {
    saveTokenFromCallbackURL(location.href).then(token => {
        console.log(token);
        history.replaceState("", "", "/");
    });
}

const context = new Context({
    store: appStoreGroup,
    dispatcher: new Dispatcher()
});
appLocator.context = context;
if (process.env.NODE_ENV !== "production") {
    const { AlminLogger } = require("almin-logger");
    const logger = new AlminLogger();
    logger.startLogging(context);
}
const App = AlminReactContainer.create(AppContainer, context);
context.useCase(createBootSubscriptionUseCase()).execute().then(() => {
    ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
});
registerServiceWorker();
