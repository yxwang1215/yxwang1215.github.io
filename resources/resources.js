/* Public starter collection. Edit this file to publish new curated resources. */
window.RESEARCH_SHELF_SEED = [{
  id: 'moe-training-handbook-2026',
  title: 'The Ultimate MoE Training Handbook',
  url: 'https://huggingface.co/spaces/huggingface/moe-blogpost',
  category: 'MoE',
  type: 'guide',
  source: 'Hugging Face · Nouamane Tazi, Leandro von Werra, Thomas Wolf',
  status: 'to-read',
  starred: true,
  published: '2026-11-05',
  createdAt: '2026-11-09T07:00:00.000Z',
  summary: '基于约 80 万 GPU 小时训练经验的 MoE 实践手册，系统梳理专家设计、Router、负载均衡、All-to-all 通信、训练稳定性、推理与 RL。约 7 万词，附有交互图表和可运行代码。',
  tags: ['MoE', 'Expert Routing', 'Load Balancing', 'Training Systems', 'RL'],
  notes: '建议阅读顺序：\n① §3.1 Router：Softmax、Sigmoid、精度与稳定性。\n② §3.3 Load Balancing：Aux Loss 与 Loss-free Bias。\n③ §3.7 Systems：Expert Parallelism 与 All-to-all。\n④ §4 Serving & RL：训练与推理的 Routing 一致性。\n\n与 MoE-OPD 相关的待验证问题：\n• 推理端与训练端路由不一致，会如何影响 token-level distillation？\n• Expert Parallelism 的通信成本如何影响 OPD rollout 吞吐量？\n• 是否能够降低服务时每个 token 的激活专家数，同时控制性能损失？',
  links: [
    {label:'中文全文翻译', url:'https://www.52nlp.cn/ainlp-53902ba7529b8615f4b1'},
    {label:'配套训练脚本与代码', url:'https://gist.github.com/nmntz/5de952d686f66d7bce5bce8cba9d7139'},
    {label:'55 张交互式图表', url:'https://huggingface.co/spaces/huggingface/moe-gallery'}
  ]
}];