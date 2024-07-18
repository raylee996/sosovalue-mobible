import { useIsomorphicLayoutEffect } from "ahooks";

export const useFixGoogleTranslation = () => {
  useIsomorphicLayoutEffect(() => {
    if (typeof Node === "function" && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild as any;
      Node.prototype.removeChild = function (child: Node) {
        if (child.parentNode !== this) {
          if (console) {
            console.error(
              "Cannot remove a child from a different parent",
              child,
              this
            );
            console.error(
              "google translation bug: https://github.com/facebook/react/issues/11538  https://bugs.chromium.org/p/chromium/issues/detail?id=872770"
            );
          }
          return child;
        }
        return originalRemoveChild.apply(this, arguments as any);
      };

      const originalInsertBefore = Node.prototype.insertBefore as any;
      window.Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.error(
              "Cannot insert before a reference node from a different parent",
              referenceNode,
              this
            );
          }
          return newNode;
        }
        return originalInsertBefore.apply(this, arguments as any);
      };
    }
  }, []);
};
