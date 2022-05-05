class Encrypter {
 async compare(password, hashPassword) {
     return true;
 }
}


describe("Encrypter", () => {
  it("Should return true if bcrypt returns true", async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare("anyPassword", "anyHash");
    expect(isValid).toBe(true);
  });
});
