import React from "react";
import ReactTestRenderer from "react-test-renderer";

import { PriorityBadge, StatusBadge } from "../src/components/Badges";

test("StatusBadge renders in-progress label", async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<StatusBadge status="in_progress" />);
  });
  expect(JSON.stringify(tree!.toJSON())).toContain("In progress");
});

test("PriorityBadge renders critical label", async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<PriorityBadge priority="critical" />);
  });
  expect(JSON.stringify(tree!.toJSON())).toContain("Critical");
});
