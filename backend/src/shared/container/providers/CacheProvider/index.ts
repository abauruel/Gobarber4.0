import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';
import CacheProvider from './implementations/CacheProvider';

const provider = {
  redis: CacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', provider.redis);
