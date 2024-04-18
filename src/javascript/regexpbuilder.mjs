/**
 * The regular expression builder
 * module for JS6.
 */
 
/**
 * The class handling string flags.
 */
export class Flags {
  
  /**
   * The delimeter of the flags in String representation.
   * @type {string}
   */
  static defaultDelimiter = "";
  
  /**
   * @param {Flags|string} flags The initial flags.
   * @param {Flags|string} added The added flags.
   * @param { string | RegExp } [delimiter] The parsing delimeter.
   * @param { string } [formatDelimiter] The delimeter separating the flags in result.
   * @returns {string} The combined flags containing the given flags, and added flags, andä nothing else.
   */
  static setFlag(flags, added, delimiter=Flags.defaultDelimiter, formatDelimiter=Flags.defaultDelimiter) {
    if (added) {
      return (flags.split(delimiter).concat(
        added.split(delimiter)).reduce(
          (result, flag) => (
            result.includes(flag) ?result:result.push(flag)), [])
        ).join(formatDelimeter);
    } else {
      return flags.toString();
    }
  }
  
  /**
   * Remove one or more flags.
   * @param {string|Flags} flags The current flags.
   * @param {Flags|string} removed The removed flag(s)
   * @param { string | RegExp } [delimiter] The parsing delimeter.
   * @param { string } [formatDelimiter] The delimeter separating the flags in result.
   * @return {string} The flags without the removed flags.
   */
  static removeFlag(flags, removed, delimiter=Flags.defaultDelimiter, formatDelimiter=Flags.defaultDelimiter) {
    const removedFlags = (removed ?? "").split(delimiter);
    return flags.split(delimiter).filter( (flag)=>(!removedFlags.includes(flag))).join(formatDelimiter);
  }
  
  /**
   * Toggle flags 
   * @param {Flags|string} flags The source flags.
   * @param {Flags|string} toggled The toggledvflags.
   * @param {string|RegExp} [delimiter] The parsing delimeter.
   * @param {string} [formatDelimiter] The delimeter separating the flags in result.
   * @returns {string} The flags of the source flags with all flags of toggled not in flags added qnd all flags of source included in toggled removed.

   */
  static toggleFlag(flags, toggled, delimiter=Flags.defaultDelimiter, formatDelimiter=Flags.defaultDelimiter) {
    const currentFlags = flags.split(delimiter);
    const toggledFlags = toggled.split(delimiter);
    return currentFlags.filter(
      (flag) => (!toggledFlags.includes(flag))).concat( toggledFlags.filter( (flag) => (!(currentFlags.includes(flag))))).join(formatDelimiter);
  }
  
  /**
   * The parse delimeter.
   * @type {string|RegExp}
   */
  get parseDelimeter() {
    return Flags.defaultDelimiter;
  }
  
  /**
   * The format delimeter.
   * @type {string} The format delimeter.
   */
  get formatDelimeter() {
    return Flags.defaultDelimiter;
  }
  
  /**
   * The string containing the set flags as string.
   */
  #flags = "";
  
  /**
   * Create new flags from string representation.
   * @param {Flags|string} [flags=""] The initial flags.
   */
  constructor(flags="") {
    this.#flags = Flags.set("", flags);
  }
  
  /**
   * Adds given flag(s) to the flags.
   * @param {Flags|string} added The added flags.
   * @return {Flags} The flags containing both current and added flags.
   */
  concat(added) {
    if (this === added) {
      return this;
    }
    return new Flags(Flags.setFlag(this.toString(), added));
  }
  
  /**
   * Remove flags.
   * @param {Flags|string} removed The removed flags.
   * @returns {Flags} The flags containing the curent flags not included in the removed flags.
   */
  delete(removed) {
    if (this === removed) {
      return new Flags();
    }
    if (removed) {
    return new Flags(Flags.deleteFlags(this.#flags, removed));
    } else {
      return this;
    }
  }
  
  /**
   * Does the flags contain all tested flags.
   * @param {Flags|string} tested The tested flags.
   * @return {boolean} True, if and only if all tested flags is included in the current flags.
   */
  includes(tested) {
    if (tested === this) {
      return true;
    }
    return tested && tested.split("").every( 
      (flag) => (this.#flags.includes(flag)));
  }
  
  /**
   * Get the length of the string representation. 
   * @return The length of the string representation.
   */
  get length() {
    return this.toString().length;
  }
  
  /**
   * Get the number of flags.
   * @return {number} The number of flags in the flags.
   */
  get size() {
    return this.length;
  }
  
  /**
   * Get flag ar index.
   * @param {numbet} index The index of the flag.
   * @returns {string?} The flag at the given index. An undefined value, if the index is invalid 
   */
  get(index) {
    if (index >= 0 && index < this.size) {
      return this.toString().charAt(index);
    } else {
      return "";
    }
  }

  /**
   * Does flags have a flag 
   * @param {string} flag The tested flag.
   * @returns {boolean} True, if and only if the flags has given flag.
   */
  has(flag) {
    return flag && this.getKeys().includes(flag);
  }
  
  /**
   * Get the set of the tested flags.
   * @param {Flags|string} tested 
   */
  intersect(tested) {
    if (tested === this) {
      return this;
    } else if (tested) {
      return new Flags();
    } else {
      return new Flags(
        tested.split(this.delimiter).filter( (flag) => (this.has(flag))).join(this.formatDelimiter));
    }
  }
  
  /**
   * Get the flags not given.
   * @param {Flags|string} flags The flags not included.
   */
  difference(flags) {
    if (!flags) {
      return this;
    } else if (this === flags) {
      return new Flags();
    } else {
      const removed = flags.split(this.delimiter);
      return new Flags(this.getKeys().filter( (flag) => (removed.includes(flag))).join(this.formatDelimiter));
    }
  }
  
  /**
   * Get the flags.
   *
   * @returns {Array<string>} The iterator of the flags.
   */
  getKeys() {
    return this.#flags.split("");
  }
  
  valueOf() {
    return this.#flags;
  }
  
  toString() {
    return this.#flags;
  }
  
  toJSON() {
    return this.toString();
  }
}

/**
 * @typedef {Object} RegExpBuilderParam
 * @property {string} [mandatoryFlags] The mandatory flags in stringm
 * @property {string} [prohibitedFlags] The progibited flags in string.
 * @property {string} [flags] The current flags.
 * @property {(RegExp|RegExpBuilder)[]} [segments=[]]
 */

/**
 * The segment list type.
 * @typedef {Array<RegExp|RegExpBuilder>} SegmentList
 */

/**
 * The regular expression builder class.
 */
export class RegExpBuilder {

  /**
   * The regular expression segments.
   * @type {Array<RegExp|RegExpBuilder>}
   */
  #segments = [];

  /**
   * The current flags.
   */
  #currentFlags = "";

  /**
   * The flags not allowed.
   */
  #prohibitedFlags = "";

  /**
   * The flags required.
   */
  #mandatoryFlags = "";

  /**
   * Creates a new regular expression builder.
   * @param {RegExpBuilderParam} [params] Yhe parameters defining the initial state.
   */
  constructor(params = {}) {
    this.#prohibitedFlags = this.checkProhibitedFlags(params.prohibitedFlags ?? "", params.segments);
    this.#mandatoryFlags = this.checkMandatoryFlags(params.mandatoryFlags, params.segments);
    this.#currentFlags = this.checkCurrentFlags(params.flags ?? this.mandatoryFlags, params.segments);
    this.#segments.push(...(params.segments ?? []));
  }

  /**
   * Check validity of the mandatory flags.
   * @param {string} [flags=""] The mqndatory flags.
   * @param {SegmentList} [segments] The segments of the builder.
   * @returns {string} The mandatory flags including the flags required by the segments.⁰
   * @throws {TypeError} Segment  contained invalid segment.
   * @throws {SyntaxError} Segment contained a prog7bited flag.
   */
  checkMandatoryFlags(flags = "", segments = undefined) {
    let result = flags.split("").concat((segments ?? []).map((entry) => {
  if (entry instanceof RegExp) {
    return entry.flags.split("");
  } else if (entry instanceof RegExpBuilder) {
    return entry.flags.split("");
  } else {
    throw new TypeError("Invalid segment");
  }
})).reduce((res, flag) => {
  if (!res.includes(flag)) {
    return res.concat(flag);
  } else {
    return res;
  }
}, "");
return result;
  }

  /**
   * Check validity of the prohibited flags. The method requires the mandatory flags has been updated.
   * @param {string} [flags=""] The prohibited flags regardless the segments.
   * @param {SegmentList} [segments] The segments of the builder.
   * @returns {string} The prohibited flags including flags prohibited by segments.
   * @throws {TypeError} Segment  contained invalid segment.
   * @throws {SyntaxError} Segment contained a prog7bited flag.
   */
  checkProhibitedFlags(flags = "", segments = undefined) {
    let result = flags.split("").concat((segments ?? []).map((entry) => {
      if (entry instanceof RegExp) {
        return this.getProhibitedFlags(entry.flags).split("");
      } else if (entry instanceof RegExpBuilder) {
        return entry.prohibitedFlags.split("");
      } else {
        throw new TypeError("Invalid segment");
      }
    })).reduce((res, flag) => {
      if (this.mandatoryFlags.includes(flag)) {
        throw new SyntaxError("Incompatible flag " + flag);
      } else if (!res.includes(flag)) {
        return res.concat(flag);
      } else {
        return res;
      }
    }, "");
    return result;
  }

  /**
   * Check validity of the current flags. The method requires the prohibited and mandatory flags has been updated.
   * @param {string} [flags=""] The flags.
   * @param {SegmentList} [segments] The segments of the builder.
   * @returns {string} The current flags.
   * @throws {TypeError} Segment  contained invalid segment.
   * @throws {SyntaxError} Segment contained a prog7bited flag.
   */
  checkCurrentFlags(flags = "", segments = undefined) {
    let result = flags.split("").concat((segments ?? []).map((entry) => {
  if (entry instanceof RegExp) {
    return entry.flags.split("");
  } else if (entry instanceof RegExpBuilder) {
    return entry.flags.split("");
  } else {
    throw new TypeError("Invalid segment");
  }
})).reduce((res, flag) => {
  if (this.prohibitedFlags.includes(flag)) {
    throw new SyntaxError("Incompatible flag " + flag);
  } else if (!this.mandatoryFlags.includes(flag) ||!res.includes(flag)) {
    return res.concat(flag);
  } else {
    return res;
  }
}, "");
return result;
  }

  /**
   * Get prohibited flags of the given flags.
   * @param {string} [flags=""] The flags, whose prohibited flags is determined.
   * @returns {string} The prohibited flags in string.
   */
  getProhibitedFlags(flags = "") {
    return "";
  }


  /**
   * The prohibited flags in string.
   */
  get prohibitedFlags() {
    return getProhibitedFlags(this.#prohibitedFlags, this.segments);
  }

  /**
   * The mandatory flags, which cannot be removed.
   */
  get mandatoryFlags() {
    return this.#mandatoryFlags;
  }

  get currentFlags() {
    return this.#currentFlags;
  }

  /**
   * The flags of the regular expression.
   */
  get flags() {
    return Flags.setFlag(this.mandatoryFlags.concat(this.#currentFlags), this.getSegmentFlags(this.segments));
  }
  
  addMandatoryFlags(flags) {
    if (!flags) {
      return this;
    }
    const currentFlags = new Flags(this.#mandatoryFlags);
    const addedFlags = new Flags(flags);
    if (currentFlags.includes(addedFlags)) {
      return this;
    } else if (addedFlags.includes(this.prohibitedFlags)) {
      throw new SyntaxError(`Prohibited mandatory flag ${
        addedFlags.intersect(this.prohibitedFlags)
      }`);
    } else {
      // Testing, if new flags prohibits current flags
      const newProhibited = new Flags(this.getProhibitedFlags(addedFlags.toString()));
      if (newProhibited.includes(this.flags)) {
        throw new SyntaxError(`Mandatory flag would prohibit an existing flags ${
          newProhibited.intersect(this.flags)
        }`)
      }
      
      return new RegExpBuilder({
        ...this,
        mandatoryFlags: currentFlags.concat(addedFlags).toString()
      });
    }
  }

  /**
   * The source of the regular expression.
   */
  get source() {
    return segments.reduce(
      (result, segment) => {
        result.push(segments.source);
        return result;
      }, []).join("");
  }
  
  /**
   * The string representation of the regular expression.
   */
  toString() {
    return `/${this.source}/${this.flags}`;
  }
  
  /**
   * Build the regular expression.
   * @returns {RegExp} The regular expression.
   */
  build() {
    return new RegExp(this.source, this.flags);
  }
}