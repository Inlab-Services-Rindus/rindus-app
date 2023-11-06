"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../config/common");
describe('common', () => {
    describe('app', () => {
        describe('url', () => {
            it('should keep env value if present', () => {
                const envUrl = 'an url';
                const config = (0, common_1.getCommonConfig)({
                    URL: envUrl,
                });
                expect(config).toEqual(expect.objectContaining({
                    app: expect.objectContaining({
                        url: envUrl,
                    }),
                }));
            });
            it('should keep undefined if no value present', () => {
                const config = (0, common_1.getCommonConfig)({});
                expect(config).toEqual(expect.objectContaining({
                    app: expect.objectContaining({
                        url: undefined,
                    }),
                }));
            });
        });
    });
});
