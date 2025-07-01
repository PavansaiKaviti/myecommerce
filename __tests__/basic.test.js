describe("Basic Test Suite", () => {
  test("should pass basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should handle async operations", async () => {
    const result = await Promise.resolve("test");
    expect(result).toBe("test");
  });

  test("should mock fetch correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "success" }),
    });

    const response = await fetch("/api/test");
    const data = await response.json();

    expect(data.message).toBe("success");
  });
});
