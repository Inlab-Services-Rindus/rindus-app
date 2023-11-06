"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const local_1 = require("../../config/local");
describe('local', () => {
    describe('app', () => {
        describe('url', () => {
            it('should keep url value if present', () => {
                const url = 'an url';
                const config = (0, local_1.getLocalConfig)({
                    app: {
                        url,
                    },
                });
                expect(config).toEqual(expect.objectContaining({
                    app: expect.objectContaining({
                        url: url,
                    }),
                }));
            });
            it('should calculate url value from domain and port', () => {
                const domain = 'domain';
                const port = 1234;
                const config = (0, local_1.getLocalConfig)({
                    app: {
                        domain,
                        port,
                    },
                });
                expect(config).toEqual(expect.objectContaining({
                    app: expect.objectContaining({
                        url: `http://${domain}:${port}`,
                    }),
                }));
            });
        });
    });
});
