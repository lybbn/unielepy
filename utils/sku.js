/**
 * SKU 计算工具
 * 迁移自旧 common.js selectGoodsSKU
 */

// 商城商品 SKU 选择：obj 商品详情，selectArray 选择的规格值 id 数组
export function selectGoodsSKU(obj, selectArray) {
  const skus = obj.skus || []
  const specLength = selectArray.length
  for (let i = 0; i < skus.length; i++) {
    const tempSpecArray = []
    skus[i].spec.forEach(item => {
      tempSpecArray.push(item.spec_value_id)
    })
    const tempNewSpecArray = tempSpecArray.filter(v => selectArray.indexOf(v) !== -1)
    if (tempNewSpecArray.length === specLength) {
      return skus[i]
    }
  }
  return {}
}
