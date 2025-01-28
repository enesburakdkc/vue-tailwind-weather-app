export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser.');
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            reject('Location access is required.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject('Location information is unavailable.');
                            break;
                        case error.TIMEOUT:
                            reject('Location request timed out.');
                            break;
                        default:
                            reject('An unknown error occurred while accessing location.');
                            break;
                    }
                }
            );
        }
    });
}