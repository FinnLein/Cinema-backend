import { TBaseProviderOptions } from './base-provider-options.types'

export type TProviderOptions = Pick<TBaseProviderOptions, 'client_id' | 'client_secret' | 'scope'>