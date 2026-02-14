describe("template spec", () => {
  it("visits the app", () => {
    cy.visit("/");
    cy.contains("StudySync").should("be.visible");
  });
});
