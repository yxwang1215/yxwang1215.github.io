# Agentic Coding Data & Evaluation Audit Checklist

A practical checklist for reviewing SFT trajectories, coding-agent harnesses, verifiers, and benchmark pipelines before training or publishing results.

## 1. Data Provenance and Licensing

- [ ] Record the source, collection date, license, and redistribution terms for every dataset component.
- [ ] Separate human, model-generated, execution-generated, and transformed data.
- [ ] Preserve the original sample identifier and transformation history.
- [ ] Document the teacher model, prompt, sampling parameters, and filtering procedure.
- [ ] Remove credentials, private repositories, personal data, and confidential artifacts.
- [ ] Check train/evaluation overlap at repository, issue, patch, and near-duplicate levels.

## 2. Harness and Protocol Compatibility

- [ ] Record the exact tool schema, message format, action grammar, and stopping rule.
- [ ] Compare training and deployment harnesses explicitly.
- [ ] Map tool names and arguments when merging data from different harnesses.
- [ ] Verify observation formatting, truncation, ordering, and error behavior.
- [ ] Preserve tool failures and recovery steps when they are part of the target behavior.
- [ ] Test whether the trained model can emit syntactically valid actions before measuring task success.
- [ ] Distinguish protocol failure from reasoning or coding failure.

## 3. Trajectory Integrity

- [ ] Confirm that every tool result could have been produced by the preceding action.
- [ ] Reject invented test output, fabricated file content, and impossible environment transitions.
- [ ] Check that timestamps, working directories, branches, and file paths remain consistent.
- [ ] Verify that patches apply cleanly to the stated repository state.
- [ ] Ensure the final answer reflects the actual terminal or repository state.
- [ ] Preserve negative trajectories only when their failure mode is known and useful.
- [ ] Avoid mixing hidden evaluator information into the model-visible trajectory.

## 4. Supervision Target Quality

- [ ] Decide whether the target is action prediction, full trajectory imitation, patch generation, explanation, or recovery behavior.
- [ ] Remove duplicated boilerplate and non-causal commentary.
- [ ] Check that the chosen response is valid under the target harness.
- [ ] Mark boundaries between user text, reasoning, actions, observations, and final answer.
- [ ] Avoid supervising unsupported claims of test success.
- [ ] Keep corrections minimal when teaching recovery from a specific mistake.
- [ ] Separate style preferences from correctness-critical supervision.

## 5. Repository and Environment Reproducibility

- [ ] Pin the repository commit, dependency versions, operating system, compiler, and runtime.
- [ ] Store setup and reset scripts.
- [ ] Confirm that tests run without network access when the evaluator assumes isolation.
- [ ] Enforce resource, time, disk, and process limits.
- [ ] Check for flaky tests and nondeterministic build steps.
- [ ] Verify that the initial state can be recreated after every episode.
- [ ] Record unavailable dependencies rather than silently changing the task.

## 6. Verifier Design

- [ ] Use deterministic tests for correctness whenever possible.
- [ ] Separate patch application, build success, public tests, hidden tests, and regression checks.
- [ ] Add tests for the reported bug, nearby behavior, and unintended side effects.
- [ ] Check that the verifier cannot be bypassed by deleting tests, hard-coding outputs, or altering configuration.
- [ ] Detect empty patches, no-op formatting changes, and environment tampering.
- [ ] Record partial-credit components rather than only one opaque score.
- [ ] Use LLM-as-judge only for dimensions that deterministic checks cannot measure.
- [ ] Calibrate judge prompts and report agreement with human or deterministic labels.

## 7. Credit Assignment and Filtering

- [ ] Identify which actions materially caused the verified final state.
- [ ] Distinguish exploratory steps from harmful repetition.
- [ ] Penalize protocol violations separately from incorrect code.
- [ ] Detect trajectories that reach the answer through leaked or invalid information.
- [ ] Compare outcome-only filtering with step-level or segment-level filtering.
- [ ] Preserve useful recovery examples instead of discarding every imperfect trajectory.
- [ ] Track filter acceptance rates by task family and difficulty.

## 8. Security and Safety

- [ ] Sandbox untrusted repositories and generated code.
- [ ] Disable credential access, host mounts, privileged containers, and unrestricted networking.
- [ ] Scan outputs for secrets and dangerous persistence mechanisms.
- [ ] Distinguish authorized vulnerability repair from exploit deployment.
- [ ] Prevent the model from modifying the evaluator, hidden tests, or scoring scripts.
- [ ] Log subprocesses, network attempts, and filesystem writes during evaluation.
- [ ] Review dataset licenses and organizational policy before including security-sensitive artifacts.

## 9. Metrics

- [ ] Report task success and patch correctness separately.
- [ ] Report action-format validity, tool-call success, and recovery rate.
- [ ] Report pass@1 and sampling budget when multiple attempts are allowed.
- [ ] Track tokens, tool calls, wall-clock time, and environment cost.
- [ ] Report performance by repository, language, issue type, and difficulty.
- [ ] Measure regression rate and security side effects.
- [ ] Include confidence intervals or repeated-run variance.
- [ ] Avoid comparing systems with different tools, context, retries, or test access without stating the difference.

## 10. Leakage and Benchmark Contamination

- [ ] Search exact issue text, patch hunks, tests, and repository snapshots in the training corpus.
- [ ] Check near-duplicates and translated or reformatted variants.
- [ ] Separate pre-cutoff and post-cutoff tasks when relevant.
- [ ] Record whether the teacher could have memorized the benchmark.
- [ ] Keep private hidden tests out of prompts, logs, and released traces.
- [ ] Publish enough information for audit without exposing protected evaluator assets.

## 11. Release Readiness

- [ ] Provide a dataset card, schema, examples, and known limitations.
- [ ] Version the harness, dataset, evaluator, and prompt independently.
- [ ] Include scripts for validation, deduplication, and statistics.
- [ ] Release representative failure cases, not only successful demos.
- [ ] State which claims are supported by execution and which rely on judgment.
- [ ] Make the evaluation command reproducible from a clean environment.

## Audit Summary Template

| Dimension | Evidence inspected | Finding | Severity | Recommended action | Owner |
|---|---|---|---|---|---|
| Harness compatibility | 200 sampled trajectories | tool arguments differ from deployment schema | high | add canonical action mapper and validation | — |

Prepared by **Yuxuan Wang** · [yxwang1215.github.io](https://yxwang1215.github.io/) · Contact: **yxwang1215@gmail.com**
