"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionModule = void 0;
const common_1 = require("@nestjs/common");
const extractor_port_1 = require("./domain/extractor.port");
const extraction_service_1 = require("./extraction.service");
const rules_extractor_1 = require("./rules.extractor");
let ExtractionModule = class ExtractionModule {
};
exports.ExtractionModule = ExtractionModule;
exports.ExtractionModule = ExtractionModule = __decorate([
    (0, common_1.Module)({
        providers: [
            extraction_service_1.ExtractionService,
            { provide: extractor_port_1.ACTION_EXTRACTOR, useClass: rules_extractor_1.RulesExtractor },
        ],
        exports: [extraction_service_1.ExtractionService],
    })
], ExtractionModule);
//# sourceMappingURL=extraction.module.js.map