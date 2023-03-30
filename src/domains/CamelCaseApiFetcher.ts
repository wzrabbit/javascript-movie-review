import typia from 'typia';
import { ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '../constants';

class NoMatchDataError extends Error {}

class CamelCaseAPIFetcher {
  async fetch<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      const responseJSON = this.changeKeysToCamelCase(await response.json());

      if (!typia.is<T>(responseJSON)) {
        const errorMessage =
          typeof responseJSON.status === 'number' && ERROR_MESSAGE[responseJSON.status]
            ? ERROR_MESSAGE[responseJSON.status]
            : UNKNOWN_ERROR_MESSAGE;

        throw new NoMatchDataError(errorMessage);
      }

      return responseJSON;
    } catch (error) {
      console.log(error);
      throw new Error(error instanceof NoMatchDataError ? error.message : UNKNOWN_ERROR_MESSAGE);
    }
  }

  private changeKeysToCamelCase(apiObject: Record<string, unknown>) {
    const changedApiObject: Record<string, unknown> = {};

    Object.entries(apiObject).forEach(([key, value]: [string, unknown]) => {
      changedApiObject[this.convertToCamelCase(key)] = value;
    });

    return changedApiObject;
  }

  private convertToCamelCase(key: string) {
    return key.replace(/[-_](.)/g, (_, word) => word.toUpperCase());
  }
}

export default CamelCaseAPIFetcher;
