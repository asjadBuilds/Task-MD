import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("returns the initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage({ key: "testKey", initialValue: "default" })
    );

    const [storedValue] = result.current;
    expect(storedValue).toBe("default");
  });

  it("reads an existing value from localStorage", () => {
    window.localStorage.setItem("testKey", JSON.stringify("savedValue"));

    const { result } = renderHook(() =>
      useLocalStorage({ key: "testKey", initialValue: "default" })
    );

    const [storedValue] = result.current;
    expect(storedValue).toBe("savedValue");
  });

  it("saves a new value to localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage({ key: "testKey", initialValue: "default" })
    );

    act(() => {
      const [, setValue] = result.current;
      setValue("newValue");
    });

    const [storedValue] = result.current;
    expect(storedValue).toBe("newValue");
    expect(window.localStorage.getItem("testKey")).toBe(JSON.stringify("newValue"));
  });

  it("updates value using a function", () => {
    const { result } = renderHook(() =>
      useLocalStorage({ key: "count", initialValue: 0 })
    );

    act(() => {
      const [, setValue] = result.current;
      setValue((prev: number) => prev + 1);
    });

    const [storedValue] = result.current;
    expect(storedValue).toBe(1);
    expect(window.localStorage.getItem("count")).toBe("1");
  });

  it("handles JSON parsing errors gracefully", () => {
    // Put invalid JSON into localStorage
    window.localStorage.setItem("badKey", "{not-valid-json}");

    const { result } = renderHook(() =>
      useLocalStorage({ key: "badKey", initialValue: "fallback" })
    );

    const [storedValue] = result.current;
    expect(storedValue).toBe("fallback");
  });
});
