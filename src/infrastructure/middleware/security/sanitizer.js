const sanitizeHtml = require('sanitize-html');

class InputSanitizer {
    static sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;

        const sanitized = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                sanitized[key] = sanitizeHtml(obj[key], {
                    allowedTags: [],
                    allowedAttributes: {},
                    disallowedTagsMode: 'recursiveEscape'
                });
            } else if (typeof obj[key] === 'object') {
                sanitized[key] = InputSanitizer.sanitizeObject(obj[key]);
            } else {
                sanitized[key] = obj[key];
            }
        }

        return sanitized;
    }

    static middleware() {
        return (req, res, next) => {
            if (req.body) {
                req.body = InputSanitizer.sanitizeObject(req.body);
            }
            if (req.query) {
                req.query = InputSanitizer.sanitizeObject(req.query);
            }
            if (req.params) {
                req.params = InputSanitizer.sanitizeObject(req.params);
            }
            next();
        };
    }
}

module.exports = InputSanitizer;
