# imanikurd-react-native

React Native package for the [imanikurd](https://www.npmjs.com/package/imanikurd) Kurdish Islamic toolkit. Use it in Expo and bare React Native apps with bundled offline data or remote CDN loading.

## Install

```bash
npm install imanikurd-react-native
# or
yarn add imanikurd-react-native
```

For iOS, run pod install after adding the package:

```bash
npx pod-install
```

## Quick start (remote data — smaller bundle)

```typescript
import { setupImanikurdRemote, getFullQuranAsync, calculateQibla } from "imanikurd-react-native";

setupImanikurdRemote();

const quran = await getFullQuranAsync();
const qibla = calculateQibla(36.19, 44.01);
```

## Offline mode (bundled JSON assets)

Import the JSON files you need and register them with `setupImanikurd`:

```typescript
import {
  setupImanikurd,
  getSurahsAsync,
  getPrayerTimesAsync,
} from "imanikurd-react-native";

import quran from "imanikurd-react-native/data/quran.json";
import prayerTimes from "imanikurd-react-native/data/prayer_times.json";
import dhikr from "imanikurd-react-native/data/dhikr.json";

setupImanikurd({
  "quran.json": quran,
  "prayer_times.json": prayerTimes,
  "dhikr.json": dhikr,
});

const surahs = await getSurahsAsync();
const times = await getPrayerTimesAsync("Hawler");
```

Metro automatically bundles JSON imports. The package also ships a `react-native.config.js` so `npx react-native-asset` can link the `data/` folder if you prefer filesystem assets.

## API

This package re-exports the full `imanikurd` API plus:

| Function | Description |
|----------|-------------|
| `setupImanikurd(assets)` | Load data from bundled JSON modules |
| `setupImanikurdOffline(assets)` | Same as above, clears cache first |
| `setupImanikurdRemote(baseUrl?)` | Fetch data from CDN (default: unpkg) |
| `isImanikurdConfigured()` | Check if setup was called |

See [imanikurd README](../imanikurd/README.md) for the complete API reference.

## License

MIT
