# HOT Memory — Template

> This file is created in `~/self-improving/memory.md` when you first use the skill.
> Keep it ≤100 lines. Most-used patterns live here.

## 2026-03-14 重要教训

### GitHub 上传
- **永远不要上传整个 workspace 目录** - 只上传用户明确要求的文件
- **上传前确认文件列表** - 使用 `git status` 检查
- **ESPHome 项目文件**: 只上传 `.yaml` 配置文件和 `README.md`
- **不要上传**: skills/, memory/, scripts/, 临时文件等

### 响应速度
- **减少不必要的命令** - 直接执行用户要求的操作
- **避免重复检查** - 已经确认的信息不要再次验证
- **简洁操作** - 能用一个命令完成的不要分成多个

## Example Entries

```markdown
## Preferences
- Code style: Prefer explicit over implicit
- Communication: Direct, no fluff
- Time zone: Europe/Madrid

## Patterns (promoted from corrections)
- Always use TypeScript strict mode
- Prefer pnpm over npm
- Format: ISO 8601 for dates

## Project defaults
- Tests: Jest with coverage >80%
- Commits: Conventional commits format
```

## Usage

The agent will:
1. Load this file on every session
2. Add entries when patterns are used 3x in 7 days
3. Demote unused entries to WARM after 30 days
4. Never exceed 100 lines (compacts automatically)
