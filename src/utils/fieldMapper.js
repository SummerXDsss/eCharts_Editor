// 验证字段映射
export function validateFieldMapping(field, targetRule, currentMappings) {
  // 检查字段类型是否符合目标规则
  if (!targetRule.type.includes(field.type)) {
    return { valid: false, error: '字段类型不匹配' }
  }

  // 检查是否允许多个字段
  if (!targetRule.multiple && currentMappings && currentMappings.length >= 1) {
    return { valid: false, error: '该位置只能映射一个字段' }
  }

  return { valid: true }
}

// 检查映射是否完整
export function checkMappingComplete(mappings, rules) {
  for (const [key, rule] of Object.entries(rules)) {
    if (rule.required) {
      const mapping = mappings[key]
      if (!mapping || (Array.isArray(mapping) && mapping.length === 0)) {
        return { complete: false, missing: key }
      }
    }
  }
  return { complete: true }
}
