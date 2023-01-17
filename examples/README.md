# @buntime/wrapper

A wrapper to turn AWS lambda handler into an http endpoint.

## Usage

```ts
import { buntimeWrapper } from "@buntime/wrapper";

import { handler } from "./handler.js";

export default buntimeWrapper(handler);
```
