const config = {
    url: '',
    projectName: 'eyesdk',
    appId: '123456',
    userId: '123456',
    isImageUpload: false,
    batchSize: 5,
};
export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key];
        }
    }
}
export default config;