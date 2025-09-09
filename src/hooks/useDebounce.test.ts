import { renderHook, act } from "@testing-library/react";
import useDebounce from "./useDebounce";

jest.useFakeTimers();

describe("useDebounce hook", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() =>
      useDebounce({ value: "hello", delay: 500 })
    );
    expect(result.current).toBe("hello");
  });

  it("should debounce updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      { initialProps: { value: "a", delay: 500 } }
    );

    expect(result.current).toBe("a");

    // val change before timeout
    rerender({ value: "b", delay: 500 });
    expect(result.current).toBe("a");
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("b");
  });

  it("should reset timer when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      { initialProps: { value: "x", delay: 300 } }
    );

    expect(result.current).toBe("x");

    // val multiple change
    rerender({ value: "y", delay: 300 });
    rerender({ value: "z", delay: 300 });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("x");
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("z");
  });
});
