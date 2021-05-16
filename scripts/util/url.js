function generateUrlParameter(parameters) {
    const pairs = [];

    for (const key in parameters) {
        const value = parameters[key];

        pairs.push(`${key}=${value}`);
    }

    const urlParameter = '?' + pairs.join('&');
    
    return urlParameter;
}

function parseUrlParamerter(url) {
    const result = {};

    const questionMarkPosition = url.indexOf('?');

    if (questionMarkPosition >= 0) {
        const parameterPart = url.slice(questionMarkPosition + 1);
        const eachParameter = parameterPart.split('&');
    
        eachParameter.forEach(parameter => {
            const [key, value] = parameter.split('=');
    
            result[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    }

    return result;
}

function isValidUrlParameter(parameters) {
    return containsParameter(parameters) && containsResults(parameters);
}

function containsParameter(parameters) {
    return Object.keys(parameters).length >= 0;
}

function containsResults(parameters) {
    const containsTargetName = parameters.hasOwnProperty('name') && parameters['name'];
    const containsFirstResult = parameters.hasOwnProperty('result') && parameters['result'];

    return containsTargetName && containsFirstResult;
}

export default {
    generateUrlParameter,
    parseUrlParamerter,
    isValidUrlParameter,
};