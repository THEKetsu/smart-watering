## Backend Security Audit
# npm audit report

@babel/core  <=7.29.0
@babel/core: Arbitrary File Read via sourceMappingURL Comment - https://github.com/advisories/GHSA-4x5r-pxfx-6jf8
fix available via `npm audit fix`
node_modules/@babel/core

ajv  <6.14.0
Severity: moderate
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
fix available via `npm audit fix`
node_modules/ajv

axios  1.0.0 - 1.17.0
Severity: high
Axios is vulnerable to DoS attack through lack of data size check - https://github.com/advisories/GHSA-4hjh-wcwx-xvwj
Axios has a NO_PROXY Hostname Normalization Bypass that Leads to SSRF - https://github.com/advisories/GHSA-3p68-rc4w-qgx5
Axios: Authentication Bypass via Prototype Pollution Gadget in `validateStatus` Merge Strategy - https://github.com/advisories/GHSA-w9j2-pvgh-6h63
Axios: Incomplete Fix for CVE-2025-62718 — NO_PROXY Protection Bypassed via RFC 1122 Loopback Subnet (127.0.0.0/8) in Axios 1.15.0 - https://github.com/advisories/GHSA-pmwg-cvhr-8vh7
Axios: Invisible JSON Response Tampering via Prototype Pollution Gadget in `parseReviver` - https://github.com/advisories/GHSA-3w6x-2g7m-8v23
Axios: Null Byte Injection via Reverse-Encoding in AxiosURLSearchParams - https://github.com/advisories/GHSA-xhjh-pmcv-23jw
Axios: CRLF Injection in multipart/form-data body via unsanitized blob.type in formDataToStream - https://github.com/advisories/GHSA-445q-vr5w-6q77
Axios: no_proxy bypass via IP alias allows SSRF - https://github.com/advisories/GHSA-m7pr-hjqh-92cm
Axios' HTTP adapter-streamed uploads bypass maxBodyLength when maxRedirects: 0 - https://github.com/advisories/GHSA-5c9x-8gcm-mpgx
Axios: HTTP adapter streamed responses bypass maxContentLength - https://github.com/advisories/GHSA-vf2m-468p-8v99
Axios: Prototype Pollution Gadgets - Response Tampering, Data Exfiltration, and Request Hijacking - https://github.com/advisories/GHSA-pf86-5x62-jrwf
Axios: Header Injection via Prototype Pollution - https://github.com/advisories/GHSA-6chq-wfr3-2hj9
Axios: XSRF Token Cross-Origin Leakage via Prototype Pollution Gadget in `withXSRFToken` Boolean Coercion - https://github.com/advisories/GHSA-xx6v-rp6x-q39c
Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig - https://github.com/advisories/GHSA-43fc-jf86-j433
Axios has prototype pollution read-side gadgets in HTTP adapter that allow credential injection and request hijacking - https://github.com/advisories/GHSA-q8qp-cvcw-x6jj
Axios has Unrestricted Cloud Metadata Exfiltration via Header Injection Chain - https://github.com/advisories/GHSA-fvcv-3m26-pcqx
Axios: unbounded recursion in toFormData causes DoS via deeply nested request data - https://github.com/advisories/GHSA-62hf-57xw-28j9
Axios: Regular Expression Denial of Service (ReDoS) via Cookie Name Injection - https://github.com/advisories/GHSA-hfxv-24rg-xrqf
Allocation of Resources Without Limits or Throttling in Axios - https://github.com/advisories/GHSA-777c-7fjr-54vf
Axios: Proxy-Authorization Credential Leak to Origin Server Across HTTP-to-HTTPS Redirect in Axios Node.js HTTP Adapter - https://github.com/advisories/GHSA-p92q-9vqr-4j8v
Axios: Proxy-Authorization header leaks to redirect target when proxy is re-evaluated to direct connection - https://github.com/advisories/GHSA-j5f8-grm9-p9fc
axios Vulnerable to Credential Theft and Response Hijacking via Prototype Pollution Gadget in Config Merge - https://github.com/advisories/GHSA-3g43-6gmg-66jw
axios Vulnerable to Full Man-in-the-Middle via Prototype Pollution Gadget in `config.proxy` - https://github.com/advisories/GHSA-35jp-ww65-95wh
axios has DoS & Header Injection via Prototype Pollution Read-Side Gadgets in axios merge functions - https://github.com/advisories/GHSA-898c-q2cr-xwhg
Axios: Prototype pollution gadgets can alter axios request construction - https://github.com/advisories/GHSA-mmx7-hfxf-jppx
Axios: Deep formToJSON Key Recursion Can Cause Denial of Service - https://github.com/advisories/GHSA-pmv8-rq9r-6j72
Axios: Nested axios option objects can consume polluted prototype values - https://github.com/advisories/GHSA-7q8q-rj6j-mhjq
Axios: Fetch adapter `ReadableStream` uploads bypass `maxBodyLength` - https://github.com/advisories/GHSA-jqh4-m9w3-8hp9
Axios: Excessive recursion in formDataToJSON can cause denial of service - https://github.com/advisories/GHSA-42h9-826w-cgv3
fix available via `npm audit fix`
node_modules/axios

body-parser  <=2.0.2
Severity: moderate
body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement - https://github.com/advisories/GHSA-v422-hmwv-36x6
Depends on vulnerable versions of qs
fix available via `npm audit fix`
node_modules/body-parser
  express  4.0.0-rc1 - 5.0.1
  Depends on vulnerable versions of body-parser
  Depends on vulnerable versions of path-to-regexp
  Depends on vulnerable versions of qs
  node_modules/express

brace-expansion  <=1.1.17 || 2.0.0 - 2.1.3
Severity: high
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
fix available via `npm audit fix`
node_modules/@eslint/eslintrc/node_modules/brace-expansion
node_modules/@humanwhocodes/config-array/node_modules/brace-expansion
node_modules/brace-expansion
node_modules/eslint/node_modules/brace-expansion
node_modules/glob/node_modules/brace-expansion
node_modules/test-exclude/node_modules/brace-expansion

browserslist  <=4.28.6
Severity: high
Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM - https://github.com/advisories/GHSA-c83g-rgw3-j3cx
Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats) - https://github.com/advisories/GHSA-73wf-gq98-2v4g
fix available via `npm audit fix`
node_modules/browserslist

diff  4.0.0 - 4.0.3
jsdiff has a Denial of Service vulnerability in parsePatch and applyPatch - https://github.com/advisories/GHSA-73rr-hh4g-fpgx
fix available via `npm audit fix`
node_modules/diff

flatted  <=3.4.1
Severity: high
flatted vulnerable to unbounded recursion DoS in parse() revive phase - https://github.com/advisories/GHSA-25h7-pfq9-p65f
Prototype Pollution via parse() in NodeJS flatted - https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
fix available via `npm audit fix`
node_modules/flatted

follow-redirects  <=1.15.11
Severity: moderate
follow-redirects leaks Custom Authentication Headers to Cross-Domain Redirect Targets - https://github.com/advisories/GHSA-r4q5-vmmm-2653
fix available via `npm audit fix`
node_modules/follow-redirects

form-data  4.0.0 - 4.0.5
Severity: high
form-data: CRLF injection in form-data via unescaped multipart field names and filenames - https://github.com/advisories/GHSA-hmw2-7cc7-3qxx
fix available via `npm audit fix`
node_modules/form-data

glob  10.2.0 - 10.4.5
Severity: high
glob CLI: Command injection via -c/--cmd executes matches with shell:true - https://github.com/advisories/GHSA-5j98-mcp5-4vw2
fix available via `npm audit fix`
node_modules/typeorm/node_modules/glob

handlebars  4.0.0 - 4.7.8
Severity: critical
Handlebars.js has JavaScript Injection via AST Type Confusion by tampering @partial-block - https://github.com/advisories/GHSA-3mfm-83xf-c92r
Handlebars.js has JavaScript Injection via AST Type Confusion - https://github.com/advisories/GHSA-2w6w-674q-4c4q
Handlebars.js has Prototype Pollution Leading to XSS through Partial Template Injection - https://github.com/advisories/GHSA-2qvq-rjwj-gvw9
Handlebars.js has a Prototype Method Access Control Gap via Missing __lookupSetter__ Blocklist Entry - https://github.com/advisories/GHSA-7rx3-28cr-v5wh
Handlebars.js has a Property Access Validation Bypass in container.lookup - https://github.com/advisories/GHSA-442j-39wm-28r2
Handlebars.js has JavaScript Injection via AST Type Confusion when passing an object as dynamic partial - https://github.com/advisories/GHSA-xhpv-hc6g-r9c6
Handlebars.js has Denial of Service via Malformed Decorator Syntax in Template Compilation - https://github.com/advisories/GHSA-9cx6-37pm-9jff
Handlebars.js has JavaScript Injection in CLI Precompiler via Unescaped Names and Options - https://github.com/advisories/GHSA-xjpj-3mr7-gcpf
fix available via `npm audit fix`
node_modules/handlebars

joi  <17.13.4
Severity: moderate
joi has an uncaught RangeError on deeply nested input through recursive `link()` schemas - https://github.com/advisories/GHSA-q7cg-457f-vx79
fix available via `npm audit fix`
node_modules/joi

js-yaml  <=3.15.0 || 4.0.0 - 4.3.0
Severity: high
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases - https://github.com/advisories/GHSA-h67p-54hq-rp68
JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases - https://github.com/advisories/GHSA-h67p-54hq-rp68
js-yaml: YAML merge-key chains can force quadratic CPU consumption - https://github.com/advisories/GHSA-52cp-r559-cp3m
js-yaml: YAML merge-key chains can force quadratic CPU consumption - https://github.com/advisories/GHSA-52cp-r559-cp3m
JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported - https://github.com/advisories/GHSA-5p4m-2wfm-xmqj
JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported - https://github.com/advisories/GHSA-5p4m-2wfm-xmqj
fix available via `npm audit fix`
node_modules/@istanbuljs/load-nyc-config/node_modules/js-yaml
node_modules/js-yaml

jws  <3.2.3
Severity: high
auth0/node-jws Improperly Verifies HMAC Signature - https://github.com/advisories/GHSA-869p-cjfg-cm3x
fix available via `npm audit fix`
node_modules/jws

minimatch  <=3.1.3 || 9.0.0 - 9.0.6
Severity: high
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
fix available via `npm audit fix`
node_modules/@eslint/eslintrc/node_modules/minimatch
node_modules/@humanwhocodes/config-array/node_modules/minimatch
node_modules/eslint/node_modules/minimatch
node_modules/glob/node_modules/minimatch
node_modules/minimatch
node_modules/test-exclude/node_modules/minimatch
node_modules/typeorm/node_modules/minimatch
  @typescript-eslint/typescript-estree  6.16.0 - 7.5.0
  Depends on vulnerable versions of minimatch
  node_modules/@typescript-eslint/typescript-estree
    @typescript-eslint/parser  6.16.0 - 7.5.0
    Depends on vulnerable versions of @typescript-eslint/typescript-estree
    node_modules/@typescript-eslint/parser
    @typescript-eslint/type-utils  6.16.0 - 7.5.0
    Depends on vulnerable versions of @typescript-eslint/typescript-estree
    Depends on vulnerable versions of @typescript-eslint/utils
    node_modules/@typescript-eslint/type-utils
      @typescript-eslint/eslint-plugin  6.16.0 - 7.5.0
      Depends on vulnerable versions of @typescript-eslint/type-utils
      Depends on vulnerable versions of @typescript-eslint/utils
      node_modules/@typescript-eslint/eslint-plugin
    @typescript-eslint/utils  6.16.0 - 7.5.0
    Depends on vulnerable versions of @typescript-eslint/typescript-estree
    node_modules/@typescript-eslint/utils

path-to-regexp  <0.1.13
Severity: high
path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters - https://github.com/advisories/GHSA-37ch-88jc-xwx2
fix available via `npm audit fix`
node_modules/path-to-regexp

picomatch  <=2.3.1
Severity: high
Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching - https://github.com/advisories/GHSA-3v7f-55p6-f55p
Picomatch has a ReDoS vulnerability via extglob quantifiers - https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
fix available via `npm audit fix`
node_modules/picomatch

qs  <=6.15.3
Severity: moderate
qs's arrayLimit bypass in comma parsing allows denial of service - https://github.com/advisories/GHSA-w7fw-mjwx-w883
qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion - https://github.com/advisories/GHSA-6rw7-vpxm-498p
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
qs: Denial of Service via Attacker Controlled isBuffer - https://github.com/advisories/GHSA-4mjr-xmp4-gh2g
fix available via `npm audit fix`
node_modules/qs

tar  <=7.5.20
Severity: critical
node-tar Vulnerable to Arbitrary File Creation/Overwrite via Hardlink Path Traversal - https://github.com/advisories/GHSA-34x7-hfp2-rc4v
node-tar is Vulnerable to Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization - https://github.com/advisories/GHSA-8qq5-rm4j-mr97
Arbitrary File Read/Write via Hardlink Target Escape Through Symlink Chain in node-tar Extraction - https://github.com/advisories/GHSA-83g3-92jg-28cx
tar has Hardlink Path Traversal via Drive-Relative Linkpath - https://github.com/advisories/GHSA-qffp-2rhf-9h96
node-tar Symlink Path Traversal via Drive-Relative Linkpath - https://github.com/advisories/GHSA-9ppj-qmqm-q256
Race Condition in node-tar Path Reservations via Unicode Ligature Collisions on macOS APFS - https://github.com/advisories/GHSA-r6q2-hw4h-h46w
node-tar applies PAX size override to intermediary GNU long-name/long-link headers, causing tar parser interpretation differential (file smuggling) - https://github.com/advisories/GHSA-vmf3-w455-68vh
node-tar: Process crash via PAX numeric path type confusion - https://github.com/advisories/GHSA-w8wr-v893-vjvp
node-tar: Decompression/parse DoS via unlimited input - https://github.com/advisories/GHSA-23hp-3jrh-7fpw
node-tar: Negative tar entry size causes infinite loop in archive replace - https://github.com/advisories/GHSA-8x88-c5mf-7j5w
node-tar: Uncaught Exception DoS via NUL byte in PAX path/linkpath records - https://github.com/advisories/GHSA-gvwx-54wh-qm9j
node-tar: Uncontrolled recursion in mapHas/filesFilter allows uncatchable stack-overflow DoS via crafted long-path tar with member selection - https://github.com/advisories/GHSA-r292-9mhp-454m
fix available via `npm audit fix --force`
Will install bcrypt@6.0.0, which is a breaking change
node_modules/tar
  @mapbox/node-pre-gyp  <=1.0.11
  Depends on vulnerable versions of tar
  node_modules/@mapbox/node-pre-gyp
    bcrypt  5.0.1 - 5.1.1
    Depends on vulnerable versions of @mapbox/node-pre-gyp
    node_modules/bcrypt

typeorm  <=0.3.30
Severity: high
TypeORM vulnerable to SQL injection via crafted request to repository.save or repository.update - https://github.com/advisories/GHSA-q2pj-6v73-8rgj
TypeORM: SQL Injection in UpdateQueryBuilder/SoftDeleteQueryBuilder orderBy (MySQL/MariaDB) - https://github.com/advisories/GHSA-9ggv-8w38-r7pm
 TypeORM: migration:generate template-literal code injection - https://github.com/advisories/GHSA-2rp8-mm9q-fp49
fix available via `npm audit fix`
node_modules/typeorm

uuid  <11.1.1
Severity: moderate
uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided - https://github.com/advisories/GHSA-w5hq-g745-h8pq
fix available via `npm audit fix --force`
Will install node-cron@4.2.1, which is a breaking change
node_modules/typeorm/node_modules/uuid
node_modules/uuid
  node-cron  3.0.2 - 3.0.3
  Depends on vulnerable versions of uuid
  node_modules/node-cron

31 vulnerabilities (2 low, 7 moderate, 20 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
# npm audit report

@babel/core  <=7.29.0
@babel/core: Arbitrary File Read via sourceMappingURL Comment - https://github.com/advisories/GHSA-4x5r-pxfx-6jf8
fix available via `npm audit fix`
node_modules/@babel/core

@babel/plugin-transform-modules-systemjs  7.12.0 - 7.29.0
Severity: high
@babel/plugin-transform-modules-systemjs generates arbitrary code when compiling malicious input - https://github.com/advisories/GHSA-fv7c-fp4j-7gwp
fix available via `npm audit fix`
node_modules/@babel/plugin-transform-modules-systemjs

@remix-run/router  <=1.23.2
Severity: high
React Router vulnerable to XSS via Open Redirects - https://github.com/advisories/GHSA-2w69-qvjg-hvjx
React Router's same-origin redirect with path starting // causes open redirect via protocol-relative URL reinterpretation - https://github.com/advisories/GHSA-2j2x-hqr9-3h42
fix available via `npm audit fix`
node_modules/@remix-run/router
  react-router  6.0.0 - 7.17.0
  Depends on vulnerable versions of @remix-run/router
  node_modules/react-router
    react-router-dom  6.0.0-alpha.0 - 6.30.2
    Depends on vulnerable versions of @remix-run/router
    Depends on vulnerable versions of react-router
    node_modules/react-router-dom

@tootallnate/once  <2.0.1
@tootallnate/once vulnerable to Incorrect Control Flow Scoping - https://github.com/advisories/GHSA-vpq2-c234-7xj6
fix available via `npm audit fix`
node_modules/@tootallnate/once
  http-proxy-agent  4.0.1
  Depends on vulnerable versions of @tootallnate/once
  node_modules/http-proxy-agent
    jsdom  16.6.0 - 17.0.0
    Depends on vulnerable versions of http-proxy-agent
    node_modules/jsdom
      jest-environment-jsdom  27.0.1 - 27.5.1
      Depends on vulnerable versions of jsdom
      node_modules/jest-environment-jsdom
        jest-config  27.0.1 - 27.5.1
        Depends on vulnerable versions of jest-environment-jsdom
        Depends on vulnerable versions of jest-runner
        node_modules/jest-config
          @jest/core  27.0.1 - 27.5.1
          Depends on vulnerable versions of jest-config
          Depends on vulnerable versions of jest-runner
          node_modules/@jest/core
            jest  27.0.1 - 27.5.1
            Depends on vulnerable versions of @jest/core
            Depends on vulnerable versions of jest-cli
            node_modules/jest
          jest-cli  27.0.1 - 27.5.1
          Depends on vulnerable versions of @jest/core
          Depends on vulnerable versions of jest-config
          node_modules/jest-cli
        jest-runner  27.0.4 - 27.5.1
        Depends on vulnerable versions of jest-environment-jsdom
        node_modules/jest-runner

ajv  <6.14.0 || >=7.0.0-alpha.0 <8.18.0
Severity: moderate
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
fix available via `npm audit fix`
node_modules/ajv
node_modules/ajv-formats/node_modules/ajv
node_modules/schema-utils/node_modules/ajv
node_modules/workbox-build/node_modules/ajv

axios  1.0.0 - 1.17.0
Severity: high
Axios is vulnerable to DoS attack through lack of data size check - https://github.com/advisories/GHSA-4hjh-wcwx-xvwj
Axios has a NO_PROXY Hostname Normalization Bypass that Leads to SSRF - https://github.com/advisories/GHSA-3p68-rc4w-qgx5
Axios: Authentication Bypass via Prototype Pollution Gadget in `validateStatus` Merge Strategy - https://github.com/advisories/GHSA-w9j2-pvgh-6h63
Axios: Incomplete Fix for CVE-2025-62718 — NO_PROXY Protection Bypassed via RFC 1122 Loopback Subnet (127.0.0.0/8) in Axios 1.15.0 - https://github.com/advisories/GHSA-pmwg-cvhr-8vh7
Axios: Invisible JSON Response Tampering via Prototype Pollution Gadget in `parseReviver` - https://github.com/advisories/GHSA-3w6x-2g7m-8v23
Axios: Null Byte Injection via Reverse-Encoding in AxiosURLSearchParams - https://github.com/advisories/GHSA-xhjh-pmcv-23jw
Axios: CRLF Injection in multipart/form-data body via unsanitized blob.type in formDataToStream - https://github.com/advisories/GHSA-445q-vr5w-6q77
Axios: no_proxy bypass via IP alias allows SSRF - https://github.com/advisories/GHSA-m7pr-hjqh-92cm
Axios' HTTP adapter-streamed uploads bypass maxBodyLength when maxRedirects: 0 - https://github.com/advisories/GHSA-5c9x-8gcm-mpgx
Axios: HTTP adapter streamed responses bypass maxContentLength - https://github.com/advisories/GHSA-vf2m-468p-8v99
Axios: Prototype Pollution Gadgets - Response Tampering, Data Exfiltration, and Request Hijacking - https://github.com/advisories/GHSA-pf86-5x62-jrwf
Axios: Header Injection via Prototype Pollution - https://github.com/advisories/GHSA-6chq-wfr3-2hj9
Axios: XSRF Token Cross-Origin Leakage via Prototype Pollution Gadget in `withXSRFToken` Boolean Coercion - https://github.com/advisories/GHSA-xx6v-rp6x-q39c
Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig - https://github.com/advisories/GHSA-43fc-jf86-j433
Axios has prototype pollution read-side gadgets in HTTP adapter that allow credential injection and request hijacking - https://github.com/advisories/GHSA-q8qp-cvcw-x6jj
Axios has Unrestricted Cloud Metadata Exfiltration via Header Injection Chain - https://github.com/advisories/GHSA-fvcv-3m26-pcqx
Axios: unbounded recursion in toFormData causes DoS via deeply nested request data - https://github.com/advisories/GHSA-62hf-57xw-28j9
Axios: Regular Expression Denial of Service (ReDoS) via Cookie Name Injection - https://github.com/advisories/GHSA-hfxv-24rg-xrqf
Allocation of Resources Without Limits or Throttling in Axios - https://github.com/advisories/GHSA-777c-7fjr-54vf
Axios: Proxy-Authorization Credential Leak to Origin Server Across HTTP-to-HTTPS Redirect in Axios Node.js HTTP Adapter - https://github.com/advisories/GHSA-p92q-9vqr-4j8v
Axios: Proxy-Authorization header leaks to redirect target when proxy is re-evaluated to direct connection - https://github.com/advisories/GHSA-j5f8-grm9-p9fc
axios Vulnerable to Credential Theft and Response Hijacking via Prototype Pollution Gadget in Config Merge - https://github.com/advisories/GHSA-3g43-6gmg-66jw
axios Vulnerable to Full Man-in-the-Middle via Prototype Pollution Gadget in `config.proxy` - https://github.com/advisories/GHSA-35jp-ww65-95wh
axios has DoS & Header Injection via Prototype Pollution Read-Side Gadgets in axios merge functions - https://github.com/advisories/GHSA-898c-q2cr-xwhg
Axios: Prototype pollution gadgets can alter axios request construction - https://github.com/advisories/GHSA-mmx7-hfxf-jppx
Axios: Deep formToJSON Key Recursion Can Cause Denial of Service - https://github.com/advisories/GHSA-pmv8-rq9r-6j72
Axios: Nested axios option objects can consume polluted prototype values - https://github.com/advisories/GHSA-7q8q-rj6j-mhjq
Axios: Fetch adapter `ReadableStream` uploads bypass `maxBodyLength` - https://github.com/advisories/GHSA-jqh4-m9w3-8hp9
Axios: Excessive recursion in formDataToJSON can cause denial of service - https://github.com/advisories/GHSA-42h9-826w-cgv3
fix available via `npm audit fix`
node_modules/axios

body-parser  <=2.0.2
Severity: moderate
body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement - https://github.com/advisories/GHSA-v422-hmwv-36x6
Depends on vulnerable versions of qs
fix available via `npm audit fix`
node_modules/body-parser
  express  4.0.0-rc1 - 5.0.1
  Depends on vulnerable versions of body-parser
  Depends on vulnerable versions of path-to-regexp
  Depends on vulnerable versions of qs
  node_modules/express

brace-expansion  <=1.1.17 || 2.0.0 - 2.1.3
Severity: high
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
fix available via `npm audit fix`
node_modules/brace-expansion
node_modules/filelist/node_modules/brace-expansion
node_modules/sucrase/node_modules/brace-expansion

browserslist  <=4.28.6
Severity: high
Browserslist: Unbounded memory growth (no cache eviction) via distinct query results, leading to eventual OOM - https://github.com/advisories/GHSA-c83g-rgw3-j3cx
Browserslist: Uncaught crash / prototype write via untrusted browserslist-stats.json custom stats (normalizeStats) - https://github.com/advisories/GHSA-73wf-gq98-2v4g
fix available via `npm audit fix`
node_modules/browserslist

fast-uri  3.0.0 - 3.1.5
Severity: high
fast-uri vulnerable to host confusion via literal backslash authority delimiter - https://github.com/advisories/GHSA-v2hh-gcrm-f6hx
fast-uri vulnerable to host confusion via backslash authority introducer - https://github.com/advisories/GHSA-7p8r-x3mc-p8w7
fast-uri vulnerable to path traversal via percent-encoded dot segments - https://github.com/advisories/GHSA-q3j6-qgpj-74h6
fast-uri vulnerable to host confusion via percent-encoded authority delimiters - https://github.com/advisories/GHSA-v39h-62p7-jpjc
fast-uri vulnerable to server-side request forgery via malformed IPv6 normalization - https://github.com/advisories/GHSA-f65p-4m7j-42xc
fast-uri vulnerable to host confusion via percent-encoded scheme normalization - https://github.com/advisories/GHSA-jqff-g426-hqxp
fast-uri vulnerable to host confusion via failed IDN canonicalization - https://github.com/advisories/GHSA-4c8g-83qw-93j6
fix available via `npm audit fix`
node_modules/fast-uri

flatted  <=3.4.1
Severity: high
flatted vulnerable to unbounded recursion DoS in parse() revive phase - https://github.com/advisories/GHSA-25h7-pfq9-p65f
Prototype Pollution via parse() in NodeJS flatted - https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
fix available via `npm audit fix`
node_modules/flatted

follow-redirects  <=1.15.11
Severity: moderate
follow-redirects leaks Custom Authentication Headers to Cross-Domain Redirect Targets - https://github.com/advisories/GHSA-r4q5-vmmm-2653
fix available via `npm audit fix`
node_modules/follow-redirects

form-data  3.0.0 - 3.0.4 || 4.0.0 - 4.0.5
Severity: high
form-data: CRLF injection in form-data via unescaped multipart field names and filenames - https://github.com/advisories/GHSA-hmw2-7cc7-3qxx
form-data: CRLF injection in form-data via unescaped multipart field names and filenames - https://github.com/advisories/GHSA-hmw2-7cc7-3qxx
fix available via `npm audit fix`
node_modules/form-data
node_modules/jsdom/node_modules/form-data

glob  10.2.0 - 10.4.5
Severity: high
glob CLI: Command injection via -c/--cmd executes matches with shell:true - https://github.com/advisories/GHSA-5j98-mcp5-4vw2
fix available via `npm audit fix`
node_modules/sucrase/node_modules/glob

http-proxy-middleware  >=0.16.0 <2.0.10
Severity: moderate
http-proxy-middleware `router` host+path substring matching allows Host-header-driven backend routing bypass - https://github.com/advisories/GHSA-64mm-vxmg-q3vj
fix available via `npm audit fix`
node_modules/http-proxy-middleware

js-yaml  <=3.15.0 || 4.0.0 - 4.3.0
Severity: high
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases - https://github.com/advisories/GHSA-h67p-54hq-rp68
JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases - https://github.com/advisories/GHSA-h67p-54hq-rp68
js-yaml: YAML merge-key chains can force quadratic CPU consumption - https://github.com/advisories/GHSA-52cp-r559-cp3m
js-yaml: YAML merge-key chains can force quadratic CPU consumption - https://github.com/advisories/GHSA-52cp-r559-cp3m
JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported - https://github.com/advisories/GHSA-5p4m-2wfm-xmqj
JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported - https://github.com/advisories/GHSA-5p4m-2wfm-xmqj
fix available via `npm audit fix`
node_modules/@eslint/eslintrc/node_modules/js-yaml
node_modules/eslint/node_modules/js-yaml
node_modules/js-yaml

jsonpath  *
Severity: high
JSONPath vulnerable to Prototype Pollution due to insufficient input validation of object keys in lib/index.js - https://github.com/advisories/GHSA-6c59-mwgh-r2x6
jsonpath has Arbitrary Code Injection via Unsafe Evaluation of JSON Path Expressions - https://github.com/advisories/GHSA-87r5-mp6g-5w5j
Depends on vulnerable versions of underscore
fix available via `npm audit fix`
node_modules/jsonpath

launch-editor  <=2.14.0
Severity: moderate
launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows - https://github.com/advisories/GHSA-v6wh-96g9-6wx3
fix available via `npm audit fix`
node_modules/launch-editor

lodash  <=4.17.23
Severity: high
lodash vulnerable to Code Injection via `_.template` imports key names - https://github.com/advisories/GHSA-r5fr-rjxr-66jc
lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit` - https://github.com/advisories/GHSA-f23m-r3pf-42rh
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions - https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
fix available via `npm audit fix`
node_modules/lodash

minimatch  <=3.1.3 || 5.0.0 - 5.1.7 || 9.0.0 - 9.0.6
Severity: high
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
fix available via `npm audit fix`
node_modules/filelist/node_modules/minimatch
node_modules/minimatch
node_modules/sucrase/node_modules/minimatch

nanoid  <=3.3.17
Severity: high
nanoid: non-secure generators can loop indefinitely with negative size - https://github.com/advisories/GHSA-28wg-ghj8-5hjv
nanoid: custom generators can loop indefinitely when size is zero - https://github.com/advisories/GHSA-2v37-7h3g-55p8
nanoid: Integer Overflow or Wraparound - https://github.com/advisories/GHSA-xwg4-73v4-xw9w
fix available via `npm audit fix`
node_modules/nanoid

node-forge  <=1.3.3
Severity: high
node-forge has ASN.1 Unbounded Recursion - https://github.com/advisories/GHSA-554w-wpv2-vw27
node-forge has an Interpretation Conflict vulnerability via its ASN.1 Validator Desynchronization - https://github.com/advisories/GHSA-5gfm-wpxj-wjgq
node-forge is vulnerable to ASN.1 OID Integer Truncation - https://github.com/advisories/GHSA-65ch-62r8-g69g
Forge has a basicConstraints bypass in its certificate chain verification (RFC 5280 violation) - https://github.com/advisories/GHSA-2328-f5f3-gj25
Forge has signature forgery in Ed25519 due to missing S > L check - https://github.com/advisories/GHSA-q67f-28xg-22rw
Forge has Denial of Service via Infinite Loop in BigInteger.modInverse() with Zero Input - https://github.com/advisories/GHSA-5m6q-g25r-mvwx
Forge has signature forgery in RSA-PKCS due to ASN.1 extra field   - https://github.com/advisories/GHSA-ppp5-5v6c-4jwp
fix available via `npm audit fix`
node_modules/node-forge

nth-check  <2.0.1
Severity: high
Inefficient Regular Expression Complexity in nth-check - https://github.com/advisories/GHSA-rp65-9cf3-cjxr
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/svgo/node_modules/nth-check
  css-select  <=3.1.0
  Depends on vulnerable versions of nth-check
  node_modules/svgo/node_modules/css-select
    svgo  1.0.0 - 2.8.2
    Depends on vulnerable versions of css-select
    node_modules/postcss-svgo/node_modules/svgo
    node_modules/svgo
      @svgr/plugin-svgo  <=5.5.0
      Depends on vulnerable versions of svgo
      node_modules/@svgr/plugin-svgo
        @svgr/webpack  4.0.0 - 5.5.0
        Depends on vulnerable versions of @svgr/plugin-svgo
        node_modules/@svgr/webpack
          react-scripts  >=0.1.0
          Depends on vulnerable versions of @svgr/webpack
          Depends on vulnerable versions of css-minimizer-webpack-plugin
          Depends on vulnerable versions of jest
          Depends on vulnerable versions of resolve-url-loader
          Depends on vulnerable versions of webpack-dev-server
          Depends on vulnerable versions of workbox-webpack-plugin
          node_modules/react-scripts

path-to-regexp  <0.1.13
Severity: high
path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters - https://github.com/advisories/GHSA-37ch-88jc-xwx2
fix available via `npm audit fix`
node_modules/path-to-regexp

picomatch  <=2.3.1
Severity: high
Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching - https://github.com/advisories/GHSA-3v7f-55p6-f55p
Picomatch has a ReDoS vulnerability via extglob quantifiers - https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
fix available via `npm audit fix`
node_modules/picomatch

postcss  <=8.5.22
Severity: high
PostCSS line return parsing error - https://github.com/advisories/GHSA-7fh5-64p2-3v2j
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments - https://github.com/advisories/GHSA-6g55-p6wh-862q
PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset - https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure - https://github.com/advisories/GHSA-r28c-9q8g-f849
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/postcss
node_modules/resolve-url-loader/node_modules/postcss
  resolve-url-loader  0.0.1-experiment-postcss || 3.0.0-alpha.1 - 4.0.0
  Depends on vulnerable versions of postcss
  node_modules/resolve-url-loader

postcss-selector-parser  6.1.0 - 6.1.2 || 7.1.0 - 7.1.2
postcss-selector-parser allows denial of service through uncontrolled AST recursion - https://github.com/advisories/GHSA-w9m9-85wc-3x92
postcss-selector-parser allows denial of service through uncontrolled AST recursion - https://github.com/advisories/GHSA-w9m9-85wc-3x92
fix available via `npm audit fix`
node_modules/postcss-modules-local-by-default/node_modules/postcss-selector-parser
node_modules/postcss-modules-scope/node_modules/postcss-selector-parser
node_modules/postcss-selector-parser

qs  <=6.15.3
Severity: moderate
qs's arrayLimit bypass in comma parsing allows denial of service - https://github.com/advisories/GHSA-w7fw-mjwx-w883
qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion - https://github.com/advisories/GHSA-6rw7-vpxm-498p
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
qs: Denial of Service via Attacker Controlled isBuffer - https://github.com/advisories/GHSA-4mjr-xmp4-gh2g
fix available via `npm audit fix`
node_modules/qs


rollup  <2.80.0
Severity: high
Rollup 4 has Arbitrary File Write via Path Traversal - https://github.com/advisories/GHSA-mw96-cpmx-2vgc
fix available via `npm audit fix`
node_modules/rollup

serialize-javascript  <=7.0.4
Severity: high
Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString() - https://github.com/advisories/GHSA-5c6j-r48x-rmvq
Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects - https://github.com/advisories/GHSA-qj8w-gfj5-8c6v
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/rollup-plugin-terser/node_modules/serialize-javascript
node_modules/serialize-javascript
  css-minimizer-webpack-plugin  1.1.4 - 7.0.4
  Depends on vulnerable versions of serialize-javascript
  node_modules/css-minimizer-webpack-plugin
  rollup-plugin-terser  3.0.0 || >=4.0.4
  Depends on vulnerable versions of serialize-javascript
  node_modules/rollup-plugin-terser
    workbox-build  5.0.0-alpha.0 - 7.0.0
    Depends on vulnerable versions of rollup-plugin-terser
    node_modules/workbox-build
      workbox-webpack-plugin  5.0.0-alpha.0 - 7.0.0
      Depends on vulnerable versions of workbox-build
      node_modules/workbox-webpack-plugin
  terser-webpack-plugin  4.2.1 - 5.3.16
  Depends on vulnerable versions of serialize-javascript
  node_modules/terser-webpack-plugin

shell-quote  <=1.8.4
Severity: critical
shell-quote quote() does not escape newlines in object .op values - https://github.com/advisories/GHSA-w7jw-789q-3m8p
shell-quote: Quadratic-complexity Denial of Service in `parse()` (CWE-407) - https://github.com/advisories/GHSA-395f-4hp3-45gv
fix available via `npm audit fix`
node_modules/shell-quote


underscore  <=1.13.7
Severity: high
Underscore has unlimited recursion in _.flatten and _.isEqual, potential for DoS attack - https://github.com/advisories/GHSA-qpx9-hpmf-5gmw
fix available via `npm audit fix`
node_modules/underscore

uuid  <11.1.1
Severity: moderate
uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided - https://github.com/advisories/GHSA-w5hq-g745-h8pq
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/uuid
  sockjs  >=0.3.17
  Depends on vulnerable versions of uuid
  node_modules/sockjs
    webpack-dev-server  <=5.2.6
    Depends on vulnerable versions of sockjs
    node_modules/webpack-dev-server

webpack  5.49.0 - 5.104.0
webpack buildHttp: allowedUris allow-list bypass via URL userinfo (@) leading to build-time SSRF behavior - https://github.com/advisories/GHSA-8fgc-7cc6-rx7x
webpack buildHttp HttpUriPlugin allowedUris bypass via HTTP redirects → SSRF + cache persistence - https://github.com/advisories/GHSA-38r7-794h-5758
fix available via `npm audit fix`
node_modules/webpack


websocket-driver  <=0.7.4
Severity: critical
websocket-driver: Resource limit bypass via message compression - https://github.com/advisories/GHSA-mp7j-qc5w-4988
websocket-driver: Message corruption via abuse of protocol length headers - https://github.com/advisories/GHSA-xv26-6w52-cph6
fix available via `npm audit fix`
node_modules/websocket-driver

ws  7.0.0 - 7.5.10 || 8.0.0 - 8.20.1
Severity: high
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
ws: Memory exhaustion DoS from tiny fragments and data chunks - https://github.com/advisories/GHSA-96hv-2xvq-fx4p
ws: Memory exhaustion DoS from tiny fragments and data chunks - https://github.com/advisories/GHSA-96hv-2xvq-fx4p
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

yaml  1.0.0 - 1.10.2 || 2.0.0 - 2.8.2
Severity: moderate
yaml is vulnerable to Stack Overflow via deeply nested YAML collections - https://github.com/advisories/GHSA-48c2-rrv3-qjmp
yaml is vulnerable to Stack Overflow via deeply nested YAML collections - https://github.com/advisories/GHSA-48c2-rrv3-qjmp
fix available via `npm audit fix`
node_modules/postcss-load-config/node_modules/yaml
node_modules/yaml

61 vulnerabilities (12 low, 13 moderate, 34 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
