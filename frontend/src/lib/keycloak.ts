import Keycloak from 'keycloak-js';

// Configuración directa al servidor Keycloak
const keycloakConfig = {
  url: 'http://localhost:8080', // URL base de tu Keycloak Docker
  realm: 'mi-testamento-digital',
  clientId: 'mi-app',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;