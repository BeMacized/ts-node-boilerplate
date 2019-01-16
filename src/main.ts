import 'reflect-metadata';
import { ReflectiveInjector, Injectable, Provider } from 'injection-js';
import { OnInit } from './utils/generic';
import * as winston from 'winston';

winston.configure({
    level: 'debug',
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console({
            level: 'debug'
        }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        })
    ]
});

process.on('unhandledRejection', error => winston.warn('unhandledRejection ' + error));

@Injectable()
export class Main implements OnInit {
    constructor() {}

    async onInit() {}
}

// Define providers
const providers = [
    Main
] as Provider[];

// Create injector
const injector = ReflectiveInjector.resolveAndCreate(providers);

// Call onInit of providers
(async () => {
    const inits = providers
        .map(provider => injector.get(provider))
        .filter(provider => !!provider.onInit)
        .map(provider => provider.onInit.bind(provider));
    for (const init of inits) await init();
})();
