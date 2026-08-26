# LLM Inference Audit Checklist

A practical checklist for diagnosing latency, memory, throughput, and serving instability before changing the model or buying more hardware.

## 1. Define the Workload

- [ ] Record the exact model, revision, tokenizer, precision, and serving framework.
- [ ] Separate text-only, audio, image, video, and mixed-modality requests.
- [ ] Record input-length, output-length, and concurrency distributions—not only averages.
- [ ] Report P50, P95, and P99 request sizes and arrival rates.
- [ ] Identify streaming and non-streaming traffic separately.
- [ ] State the service-level objective for TTFT, inter-token latency, and end-to-end latency.
- [ ] Preserve a representative request trace for repeatable replay.

## 2. Establish a Reproducible Baseline

- [ ] Pin software versions, kernels, drivers, CUDA, compiler flags, and environment variables.
- [ ] Record CPU, GPU, memory, interconnect, storage, and network topology.
- [ ] Warm up the model before collecting measurements.
- [ ] Repeat each experiment enough times to report variance.
- [ ] Keep sampling parameters, prompts, and random seeds fixed when comparing systems.
- [ ] Verify that optimized and baseline systems produce equivalent outputs within the chosen tolerance.
- [ ] Save the exact launch command and configuration file with every result.

## 3. Measure the Right Latency Components

- [ ] Measure queueing delay separately from execution time.
- [ ] Measure preprocessing, tokenization, modality encoding, prefill, decode, and postprocessing separately.
- [ ] Report TTFT distribution, not only mean TTFT.
- [ ] Report inter-token latency or time-per-output-token distribution.
- [ ] Report end-to-end latency by input-length and output-length bucket.
- [ ] Check whether P95 degradation is caused by queueing, memory pressure, or synchronization.
- [ ] Confirm clock synchronization when metrics cross machines or processes.

## 4. Inspect KV-Cache Behavior

- [ ] Calculate theoretical KV-cache bytes per token for the exact architecture and precision.
- [ ] Compare theoretical memory with allocated and resident memory.
- [ ] Track cache occupancy, fragmentation, eviction, recomputation, and hit rate.
- [ ] Separate prompt-prefix reuse from cross-request sharing.
- [ ] Measure copy, serialization, and transfer cost before enabling offloading.
- [ ] Check whether cache compression changes output quality or numerical stability.
- [ ] Profile cache behavior by layer, head, modality, and sequence phase when relevant.
- [ ] Confirm that a lower memory footprint actually increases admissible concurrency or throughput.

## 5. Audit Batching and Scheduling

- [ ] Record effective batch size over time instead of configured maximum batch size.
- [ ] Measure batch formation delay and head-of-line blocking.
- [ ] Check prefill/decode interference under mixed request lengths.
- [ ] Compare static batching, continuous batching, and chunked prefill where supported.
- [ ] Inspect fairness and starvation for long requests.
- [ ] Verify scheduler behavior during bursts and after request cancellation.
- [ ] Quantify throughput gains together with latency regressions.

## 6. Trace Memory Movement

- [ ] Measure host-to-device, device-to-host, device-to-device, and network transfer separately.
- [ ] Confirm whether transfers overlap with computation.
- [ ] Check pinned-memory use, page faults, NUMA placement, and allocator behavior.
- [ ] Identify hidden tensor copies caused by layout, dtype, or framework boundaries.
- [ ] Measure serialization and deserialization cost for remote KV or disaggregated serving.
- [ ] Check PCIe, NVLink, RDMA, and network utilization against theoretical limits.
- [ ] Verify that offloading does not move the bottleneck from HBM to bandwidth or CPU.

## 7. Check Compute Utilization

- [ ] Capture GPU utilization together with SM occupancy, memory bandwidth, and kernel duration.
- [ ] Identify small-kernel launch overhead and synchronization gaps.
- [ ] Inspect attention, GEMM, normalization, sampling, and modality-encoder kernels separately.
- [ ] Check tensor shapes for padding and low arithmetic intensity.
- [ ] Compare prefill and decode bottlenecks independently.
- [ ] Confirm whether quantization improves end-to-end performance rather than isolated kernel speed.
- [ ] Profile CPU tokenization, request routing, and scheduler overhead.

## 8. Validate Quality and Correctness

- [ ] Define output-equivalence criteria before optimization.
- [ ] Run task-quality benchmarks, not only perplexity or token-level similarity.
- [ ] Test long-context, adversarial-length, empty, malformed, and cancellation cases.
- [ ] Check determinism and seed behavior where reproducibility matters.
- [ ] Verify memory cleanup after failed and cancelled requests.
- [ ] Add regression tests for every optimization path.

## 9. Stress and Tail-Latency Tests

- [ ] Sweep concurrency until saturation rather than testing one load point.
- [ ] Include bursty arrivals and heavy-tailed sequence lengths.
- [ ] Report request rejection, timeout, retry, and cancellation rates.
- [ ] Measure recovery after overload and after worker failure.
- [ ] Track P95/P99 latency by workload bucket.
- [ ] Test multiple models sharing the same hardware when production does so.

## 10. Decision Sheet

For every proposed optimization, record:

| Item | Current value | Target | Expected mechanism | Measurement | Quality risk | Engineering cost | Decision |
|---|---:|---:|---|---|---|---|---|
| Example: prefix-cache reuse | 22% hit rate | 50% | avoid repeated prefill | TTFT by hit/miss | stale-prefix bugs | medium | pilot |

## Minimum Evidence Before Claiming a Speedup

- Same model, data distribution, request lengths, decoding settings, and hardware
- Repeated runs with uncertainty or variance
- Mean and tail metrics
- Quality or output-equivalence checks
- Full configuration and launch commands
- Breakdown showing where the saved time or memory came from

Prepared by **Yuxuan Wang** · [yxwang1215.github.io](https://yxwang1215.github.io/) · Contact: **yxwang1215@gmail.com**
