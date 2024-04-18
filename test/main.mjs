
/**
 * Main test nodule.
 */

function createSection() {
  
}

class MainTests {
  
  
  constructor({testRootId="tests", doc=document, root=undefined, nextId=undefined}) {
    
    /**
     * The root element of the test library
     * @property
     * @type {Element}
     */
    this.root = root ?? doc.getElementById(testRootId);
    /**
     * The owner document 
     * @property {Document}
     */
    this.doc = this.root.ownerDocument;
    this.nextIds = {tests: nextId ?? 1};
  }
  
  nextId(idCategory="tests") {
    if (this.nextIds[idCategory]) {
      return this.nextIds[idCategory]++;
    } else {
      this.nextIds[idCategory] = 2;
      return 1;
    }
  }
  
  header(title, ...children) {
    const result = this.doc.createElement('header');
    const h1 = this.doc.createElement("h1");
    h1.appendChild(this.doc.createTextNode(title));
    result.appendChild(h1);
    children.forEach( (child) => {
      result.appendChild(child);
    });
    return result;
  }
  error(err, {suiteId, testId}) {
    const result = this.doc.cresteElement("div");
    result.classList.add("error");
    if (err) {
      if (err instanceof Error) {
        result.textContent = err.toString();
      } else {
        result.textContent = String(err);
      }
    } else {
      result.textContent = "";
    }
    return result;
  }
  
  createId(prefix="testId", id=undefined) {
    return `${prefix}.${(id ? id : this.nextId()).toString(16)}`;
  }
  
  createTestSuite(name=undefined) {
    const category="suite";
    const result = this.doc.createElement("section");
    const id = this.nextId(category);
    result.id = this.createId(category, id);
    result.classList.add("test",category);
    result.appendChild(this.header(name ?? `Test Suite ${id}`));
    const main = this.doc.createElement("main");
    main.id=this.createId(result.id, "cases");
    main.classList.add("cases");
    result.appendChild(main);
    return result;
  }
  
  addTestSuite(name=undefined, cases=[]) {
    const component = this.createTestSuite(name);
    this.root.appendChild(component);
    return Promise.allSettled(cases.map( (testCase) => (
      this.addTestCase({suiteId:component.id, name:testCas3.name, test: testCase.test}))));
  }
  
  addTestCase({suiteId="tests", name=undefined, test=undefined}) {
    const testId = this.nextId(suiteId);
    const result = this.doc.createElememt("article");
    result.id = this.createId(suiteId ? `${suiteId}.${testId}` : `test.${testId}`);
    const statusElem = this.doc.createElement("span");
statusElem.id = this.createId(result.id, "status");
  statusElem.textContent = "...";

    result.appendChild(this.header((name ?? `Test Case #${testId}`), statusElem));
    this.root.appendChild(result);
    const promise = new Promise(
      (resolve, reject) => {
        if (test == null) {
          resolve(false);
        } else {
          try {
            test(result);
            resolve(true)
          } catch(err) {
            reject(err);
          }
        }
      }
      ).then(
        (passed) => {
          if (passed) {
            statusElem.textContent = "Passed";
            statusElem.classList.add("success");
            return true;
          } else {
            statusElem.textContent = "Skipped";
            return null;
          }
        }, (err) => {
          statusElem.classList.add("error");
          statusElem.textContent = "Failed";
          result.appendChild(this.error(err, {suiteId, testId}));
          return false;
        }
        );
    this.doc.getElementById(suiteId)?.appendChild(result);
    return promise;
  }
}